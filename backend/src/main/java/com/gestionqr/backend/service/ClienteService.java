package com.gestionqr.backend.service;

import com.gestionqr.backend.model.Comensal;
import com.gestionqr.backend.model.Menu;
import com.gestionqr.backend.model.Pedido;
import com.gestionqr.backend.model.Pedido.EstadoPedido;
import com.gestionqr.backend.model.Plato;
import com.gestionqr.backend.model.Servicio;
import com.gestionqr.backend.model.Servicio.EstadoServicio;
import com.gestionqr.backend.model.SesionMesa;
import com.gestionqr.backend.model.repository.ComensalRepository;
import com.gestionqr.backend.model.repository.MenuRepository;
import com.gestionqr.backend.model.repository.PedidoRepository;
import com.gestionqr.backend.model.repository.PlatoRepository;
import com.gestionqr.backend.model.repository.ServicioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class ClienteService {

    @Autowired
    private ComensalRepository comensalRepository;

    @Autowired
    private ServicioRepository servicioRepository;

    @Autowired
    private PlatoRepository platoRepository;

    @Autowired
    private MenuRepository menuRepository;

    @Autowired
    private PedidoRepository pedidoRepository;

    public Optional<Menu> obtenerMenuHoy() {
        DayOfWeek dow = LocalDate.now().getDayOfWeek();
        Menu.DiaMenu dia = switch (dow) {
            case MONDAY    -> Menu.DiaMenu.Lunes;
            case TUESDAY   -> Menu.DiaMenu.Martes;
            case WEDNESDAY -> Menu.DiaMenu.Miercoles;
            case THURSDAY  -> Menu.DiaMenu.Jueves;
            case FRIDAY    -> Menu.DiaMenu.Viernes;
            case SATURDAY  -> Menu.DiaMenu.Sabado;
            case SUNDAY    -> Menu.DiaMenu.Domingo;
        };
        List<Menu> menus = menuRepository.findByDia(dia);
        return menus.isEmpty() ? Optional.empty() : Optional.of(menus.get(0));
    }

    @Transactional
    public Comensal registrarComensal(SesionMesa sesion, Integer numero, String nombre) {
        if (numero != null) {
            Optional<Comensal> existente = comensalRepository.findBySesionMesaAndNumero(sesion, numero);
            if (existente.isPresent()) {
                return existente.get();
            }
        }

        Comensal comensal = new Comensal();
        comensal.setSesionMesa(sesion);
        comensal.setNumero(numero != null ? numero : comensalRepository.countBySesionMesa(sesion) + 1);
        if (nombre != null && !nombre.isBlank()) {
            comensal.setNombre(nombre.trim());
        }
        return comensalRepository.save(comensal);
    }

    @Transactional
    public Servicio crearPedido(SesionMesa sesion, List<Map<String, Object>> items) {
        int mesa = sesion.getMesa();
        Servicio servicio = obtenerOCrearServicioAbierto(mesa);

        List<EstadoPedido> estadosActivos = List.of(
                EstadoPedido.Pendiente, EstadoPedido.EnProceso, EstadoPedido.Listo, EstadoPedido.Servido
        );

        List<Pedido> nuevos = new ArrayList<>();
        for (Map<String, Object> item : items) {
            Long platoId = extraerLong(item.get("platoId"));
            if (platoId == null) {
                throw new IllegalArgumentException("Formato de plato invalido");
            }

            Plato plato = platoRepository.findById(platoId)
                    .orElseThrow(() -> new RuntimeException("No existe el plato con id " + platoId));

            boolean esMenu = item.get("esMenu") instanceof Boolean b && b;

            Comensal comensal = null;
            Long comensalId = extraerLong(item.get("comensalId"));
            if (comensalId != null) {
                comensal = comensalRepository.findByIdWithLock(comensalId)
                        .orElseThrow(() -> new RuntimeException("Comensal no encontrado"));

                if (esMenu && pedidoRepository.existsByComensalAndEsMenuTrueAndEstadoIn(comensal, estadosActivos)) {
                    throw new IllegalStateException("MENU_YA_PEDIDO:" + comensalId);
                }
            }

            Pedido pedido = new Pedido();
            pedido.setMesa(mesa);
            pedido.setPlato(plato);
            pedido.setEstado(EstadoPedido.Pendiente);
            pedido.setServicio(servicio);
            pedido.setEsMenu(esMenu);

            if (comensal != null) {
                pedido.setComensal(comensal);
                pedido.setPersona(comensal.getNumero());
            } else {
                Integer persona = extraerInteger(item.get("persona"));
                if (persona != null) {
                    pedido.setPersona(persona);
                }
            }

            Double precio = extraerDouble(item.get("precio"));
            pedido.setPrecioUnitario(precio != null && precio > 0 ? precio : plato.getPrecio());

            nuevos.add(pedido);
        }

        servicio.getPedidos().addAll(nuevos);
        return servicioRepository.save(servicio);
    }

    public Servicio obtenerOCrearServicioAbierto(int mesa) {
        return servicioRepository
                .findFirstByMesaAndEstado(mesa, EstadoServicio.Abierto)
                .orElseGet(() -> {
                    Servicio nuevo = new Servicio();
                    nuevo.setEstado(EstadoServicio.Abierto);
                    nuevo.setMesa(mesa);
                    nuevo.setPedidos(new ArrayList<>());
                    return servicioRepository.save(nuevo);
                });
    }

    public List<Map<String, Object>> extraerItems(Map<String, Object> body) {
        Object itemsRaw = body.get("items");
        if (itemsRaw instanceof List<?> itemsList) {
            List<Map<String, Object>> items = new ArrayList<>();
            for (Object rawItem : itemsList) {
                if (rawItem instanceof Map<?, ?> rawMap) {
                    Map<String, Object> item = new LinkedHashMap<>();
                    rawMap.forEach((key, value) -> item.put(String.valueOf(key), value));
                    items.add(item);
                }
            }
            return items;
        }

        Object platosIdsRaw = body.get("platosIds");
        if (platosIdsRaw instanceof List<?> idsList) {
            List<Map<String, Object>> items = new ArrayList<>();
            for (Object rawId : idsList) {
                Long platoId = extraerLong(rawId);
                if (platoId != null) {
                    items.add(Map.of("platoId", platoId));
                }
            }
            return items;
        }

        return List.of();
    }

    public Integer extraerInteger(Object raw) {
        if (raw instanceof Number numero) return numero.intValue();
        if (raw instanceof String texto && !texto.isBlank()) {
            try { return Integer.parseInt(texto.trim()); } catch (NumberFormatException ignored) {}
        }
        return null;
    }

    public Long extraerLong(Object raw) {
        if (raw instanceof Number numero) return numero.longValue();
        if (raw instanceof String texto && !texto.isBlank()) {
            try { return Long.parseLong(texto.trim()); } catch (NumberFormatException ignored) {}
        }
        return null;
    }

    public Double extraerDouble(Object raw) {
        if (raw instanceof Number numero) return numero.doubleValue();
        if (raw instanceof String texto && !texto.isBlank()) {
            try { return Double.parseDouble(texto.trim()); } catch (NumberFormatException ignored) {}
        }
        return null;
    }
}
