package com.gestionqr.backend.service;

import java.time.*;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.gestionqr.backend.model.Pedido;
import com.gestionqr.backend.model.Pedido.EstadoPedido;
import com.gestionqr.backend.model.Plato;
import com.gestionqr.backend.model.repository.PedidoRepository;
import com.gestionqr.backend.model.repository.PlatoRepository;

@Service
public class EstadisticaService {

    @Autowired
    private PedidoRepository pedidoRepository;

    @Autowired
    private PlatoRepository platoRepository;

    public Map<String, Object> calcularEstadisticas(String periodo) {

        List<Pedido> todos = pedidoRepository.findAll();
        LocalDate hoy = LocalDate.now();
        LocalDate ayer = hoy.minusDays(1);

        // ===== RANGO DEL PERIODO =====
        LocalDate desde = switch (periodo) {
            case "2m" -> hoy.minusMonths(2);
            case "3m" -> hoy.minusMonths(3);
            case "6m" -> hoy.minusMonths(6);
            case "1y" -> hoy.minusYears(1);
            default   -> hoy.minusDays(30); // "30d"
        };

        List<Pedido> enPeriodo = todos.stream()
                .filter(p -> p.getFechaHora() != null
                        && !p.getFechaHora().toLocalDate().isBefore(desde))
                .collect(Collectors.toList());

        // ===== INGRESOS HOY / AYER =====
        double ingresosHoy = calcularIngresos(todos, hoy);
        double ingresosAyer = calcularIngresos(todos, ayer);

        long pedidosHoy = contarPedidos(todos, hoy);
        long pedidosAyer = contarPedidos(todos, ayer);

        // ===== RANKING PLATOS MÁS VENDIDOS (sin BEBIDA, filtrado por periodo) =====
        Map<Long, List<Pedido>> pedidosPorPlato = enPeriodo.stream()
                .filter(p -> p.getEstado() == EstadoPedido.Servido)
                .filter(p -> p.getPlato() != null)
                .filter(p -> p.getPlato().getTipo() != Plato.TipoPlato.BEBIDA)
                .collect(Collectors.groupingBy(p -> p.getPlato().getId()));

        List<Map<String, Object>> rankingPlatos = pedidosPorPlato.entrySet().stream()
                .sorted((a, b) -> Integer.compare(b.getValue().size(), a.getValue().size()))
                .limit(10)
                .map(e -> {
                    Plato plato = e.getValue().get(0).getPlato();
                    Map<String, Object> m = new LinkedHashMap<>();
                    m.put("nombre", plato.getNombre());
                    m.put("imagen", plato.getImagen());
                    m.put("cantidad", (long) e.getValue().size());
                    return m;
                })
                .collect(Collectors.toList());

        // ===== PLATOS NOVEDOSOS (marcados con esNovedad, incluye imagen y días desde creación) =====
        var platosAll = platoRepository.findAll();
        var novedosos = platosAll.stream()
                .filter(p -> Boolean.TRUE.equals(p.getEsNovedad()))
                .filter(p -> p.getTipo() != Plato.TipoPlato.BEBIDA)
                .collect(Collectors.toList());
        // Sin fallback: si no hay ninguno marcado, la lista queda vacía

        List<Map<String, Object>> rankingNovedosos = novedosos.stream()
                .map(plato -> {
                    long ventas = enPeriodo.stream()
                            .filter(p -> p.getPlato() != null && p.getPlato().getId().equals(plato.getId()))
                            .filter(p -> p.getEstado() == EstadoPedido.Servido)
                            .count();
                    long diasDesde = plato.getFechaCreacion() != null
                            ? ChronoUnit.DAYS.between(plato.getFechaCreacion(), LocalDate.now())
                            : 0L;
                    Map<String, Object> m = new LinkedHashMap<>();
                    m.put("nombre", plato.getNombre());
                    m.put("imagen", plato.getImagen());
                    m.put("cantidad", ventas);
                    m.put("diasDesde", diasDesde);
                    return m;
                })
                .sorted((a, b) -> Long.compare((Long) b.get("cantidad"), (Long) a.get("cantidad")))
                .collect(Collectors.toList());

        // ===== AFLUENCIA POR FRANJA HORARIA =====
        Map<String, Long> afluenciaMap = new LinkedHashMap<>();
        afluenciaMap.put("Desayuno", 0L);
        afluenciaMap.put("Comida", 0L);
        afluenciaMap.put("Cena", 0L);

        enPeriodo.stream()
                .filter(p -> p.getFechaHora() != null)
                .forEach(p -> {
                    int hora = p.getFechaHora().getHour();
                    if (hora >= 7 && hora < 12) afluenciaMap.merge("Desayuno", 1L, Long::sum);
                    else if (hora >= 12 && hora < 17) afluenciaMap.merge("Comida", 1L, Long::sum);
                    else if (hora >= 17 && hora < 24) afluenciaMap.merge("Cena", 1L, Long::sum);
                });

        List<Map<String, Object>> afluencia = afluenciaMap.entrySet().stream()
                .map(e -> {
                    Map<String, Object> m = new LinkedHashMap<>();
                    m.put("franja", e.getKey());
                    m.put("cantidad", e.getValue());
                    return m;
                })
                .collect(Collectors.toList());

        // ===== PEDIDOS POR DÍA DE LA SEMANA =====
        String[] dias = { "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo" };
        Map<DayOfWeek, Long> pedidosPorDia = enPeriodo.stream()
                .filter(p -> p.getFechaHora() != null)
                .collect(Collectors.groupingBy(
                        p -> p.getFechaHora().getDayOfWeek(),
                        Collectors.counting()));

        List<Map<String, Object>> diasSemana = new ArrayList<>();
        for (DayOfWeek d : DayOfWeek.values()) {
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("dia", dias[d.getValue() - 1]);
            m.put("cantidad", pedidosPorDia.getOrDefault(d, 0L));
            diasSemana.add(m);
        }

        // ===== RESPUESTA =====
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("ingresosHoy", ingresosHoy);
        result.put("ingresosAyer", ingresosAyer);
        result.put("pedidosHoy", pedidosHoy);
        result.put("pedidosAyer", pedidosAyer);
        result.put("rankingPlatos", rankingPlatos);
        result.put("rankingNovedosos", rankingNovedosos);
        result.put("afluencia", afluencia);
        result.put("diasSemana", diasSemana);

        return result;
    }

    private double calcularIngresos(List<Pedido> pedidos, LocalDate fecha) {
        return pedidos.stream()
                .filter(p -> p.getEstado() == EstadoPedido.Servido)
                .filter(p -> p.getFechaHora() != null && p.getFechaHora().toLocalDate().equals(fecha))
                .filter(p -> p.getPlato() != null && p.getPlato().getPrecio() != null)
                .mapToDouble(p -> p.getPlato().getPrecio())
                .sum();
    }

    private long contarPedidos(List<Pedido> pedidos, LocalDate fecha) {
        return pedidos.stream()
                .filter(p -> p.getFechaHora() != null && p.getFechaHora().toLocalDate().equals(fecha))
                .count();
    }
}

