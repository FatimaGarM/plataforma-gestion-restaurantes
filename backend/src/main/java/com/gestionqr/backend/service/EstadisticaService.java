package com.gestionqr.backend.service;

import java.time.*;
import java.util.*;
import java.util.stream.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.gestionqr.backend.model.Pedido;
import com.gestionqr.backend.model.Pedido.EstadoPedido;
import com.gestionqr.backend.repository.PedidoRepository;
import com.gestionqr.backend.repository.PlatoRepository;

@Service
public class EstadisticaService {

    @Autowired
    private PedidoRepository pedidoRepository;

    @Autowired
    private PlatoRepository platoRepository;

    public Map<String, Object> calcularEstadisticas() {

        List<Pedido> todos = pedidoRepository.findAll();
        LocalDate hoy = LocalDate.now();
        LocalDate ayer = hoy.minusDays(1);

        // ===== INGRESOS HOY / AYER =====
        double ingresosHoy = calcularIngresos(todos, hoy);
        double ingresosAyer = calcularIngresos(todos, ayer);

        long pedidosHoy = contarPedidos(todos, hoy);
        long pedidosAyer = contarPedidos(todos, ayer);

        // ===== RANKING PLATOS MÁS VENDIDOS (all-time) =====
        Map<String, Long> conteoPlatos = todos.stream()
                .filter(p -> p.getEstado() == EstadoPedido.Servido)
                .filter(p -> p.getPlato() != null)
                .collect(Collectors.groupingBy(
                        p -> p.getPlato().getNombre(),
                        Collectors.counting()));

        List<Map<String, Object>> rankingPlatos = conteoPlatos.entrySet().stream()
                .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
                .limit(10)
                .map(e -> {
                    Map<String, Object> m = new LinkedHashMap<>();
                    m.put("nombre", e.getKey());
                    m.put("cantidad", e.getValue());
                    return m;
                })
                .collect(Collectors.toList());

        // ===== PLATOS NOVEDOSOS (últimos 5 por ID) =====
        var platosAll = platoRepository.findAll();
        platosAll.sort((a, b) -> Long.compare(b.getId(), a.getId()));
        var novedosos = platosAll.stream().limit(5).collect(Collectors.toList());

        List<Map<String, Object>> rankingNovedosos = novedosos.stream()
                .map(plato -> {
                    long ventas = todos.stream()
                            .filter(p -> p.getPlato() != null && p.getPlato().getId().equals(plato.getId()))
                            .filter(p -> p.getEstado() == EstadoPedido.Servido)
                            .count();
                    Map<String, Object> m = new LinkedHashMap<>();
                    m.put("nombre", plato.getNombre());
                    m.put("cantidad", ventas);
                    return m;
                })
                .collect(Collectors.toList());

        // ===== AFLUENCIA POR FRANJA HORARIA =====
        Map<String, Long> afluenciaMap = new LinkedHashMap<>();
        afluenciaMap.put("Desayuno", 0L);
        afluenciaMap.put("Comida", 0L);
        afluenciaMap.put("Cena", 0L);

        todos.stream()
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
        Map<DayOfWeek, Long> pedidosPorDia = todos.stream()
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
