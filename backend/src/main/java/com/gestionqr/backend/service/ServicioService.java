package com.gestionqr.backend.service;

import com.gestionqr.backend.model.CobroPersona;
import com.gestionqr.backend.model.Pedido;
import com.gestionqr.backend.model.Pedido.EstadoPedido;
import com.gestionqr.backend.model.Servicio;
import com.gestionqr.backend.model.Servicio.EstadoCobro;
import com.gestionqr.backend.model.Servicio.EstadoServicio;
import com.gestionqr.backend.model.Servicio.MetodoPagoSolicitado;
import com.gestionqr.backend.model.repository.PedidoRepository;
import com.gestionqr.backend.model.repository.PlatoRepository;
import com.gestionqr.backend.model.repository.ServicioRepository;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class ServicioService {

    private static final long MINUTOS_INACTIVIDAD_CIERRE = 120;

    @Autowired
    private ServicioRepository servicioRepository;

    @Autowired
    private PlatoRepository platoRepository;

    @Autowired
    private PedidoRepository pedidoRepository;

    public List<Servicio> obtenerServiciosPorEstado(EstadoServicio estado) {
        return servicioRepository.findByEstado(estado);
    }

    public Servicio crearServicio(List<Long> platosIds, int mesa) {
        Servicio servicio = new Servicio();
        servicio.setEstado(EstadoServicio.Abierto);
        servicio.setMesa(mesa);
        servicio.setUltimaActividad(LocalDateTime.now());

        List<Pedido> pedidos = new ArrayList<>();
        for (Long platoId : platosIds) {
            Pedido pedido = new Pedido();
            pedido.setMesa(mesa);
            pedido.setPlato(platoRepository.findById(platoId).orElseThrow(() -> new RuntimeException("Plato no encontrado")));
            pedido.setEstado(EstadoPedido.Pendiente);
            pedido.setServicio(servicio);
            pedidos.add(pedido);
        }

        servicio.setPedidos(pedidos);
        return servicioRepository.save(servicio);
    }


    public Optional<Servicio> obtenerServicioAbiertoPorMesa(int mesa) {
        cerrarServicioPorInactividad(mesa);
        return servicioRepository.findFirstByMesaAndEstado(mesa, EstadoServicio.Abierto);
    }

    @Transactional
    public Servicio solicitarCobro(int mesa, String metodoPago) {
        Servicio servicio = obtenerServicioAbiertoPorMesa(mesa)
                .orElseThrow(() -> new RuntimeException("No hay un servicio abierto para la mesa"));

        if (servicio.getPedidos() == null || servicio.getPedidos().isEmpty()) {
            throw new RuntimeException("No hay pedidos para cobrar");
        }

        servicio.setMetodoPagoSolicitado(parseMetodoPago(metodoPago));
        servicio.setFechaSolicitudCobro(LocalDateTime.now());
        servicio.setUltimaActividad(LocalDateTime.now());
        sincronizarCobrosPersona(servicio);
        servicio.setEstadoCobro(EstadoCobro.PENDIENTE_COBRO);
        return servicioRepository.save(servicio);
    }

    @Transactional
    public Servicio marcarCobroEnCurso(int mesa) {
        Servicio servicio = obtenerServicioAbiertoPorMesa(mesa)
                .orElseThrow(() -> new RuntimeException("No hay un servicio abierto para la mesa"));

        if (servicio.getMetodoPagoSolicitado() == null) {
            throw new RuntimeException("La mesa no ha solicitado cobro");
        }

        sincronizarCobrosPersona(servicio);
        if (servicio.getEstadoCobro() != EstadoCobro.COBRADO_TOTAL) {
            servicio.setEstadoCobro(EstadoCobro.COBRANDO);
        }
        servicio.setUltimaActividad(LocalDateTime.now());
        return servicioRepository.save(servicio);
    }

    @Transactional
    public Servicio marcarCobroPersona(int mesa, Integer persona, boolean cobrado) {
        Servicio servicio = obtenerServicioAbiertoPorMesa(mesa)
                .orElseThrow(() -> new RuntimeException("No hay un servicio abierto para la mesa"));

        sincronizarCobrosPersona(servicio);
        CobroPersona cobroPersona = servicio.getCobrosPersona().stream()
                .filter(cp -> Objects.equals(cp.getPersona(), persona))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("No existe esa persona en el cobro"));

        cobroPersona.setCobrado(cobrado);
        cobroPersona.setFechaCobro(cobrado ? LocalDateTime.now() : null);
        actualizarEstadoCobro(servicio);
        servicio.setUltimaActividad(LocalDateTime.now());
        return servicioRepository.save(servicio);
    }

    @Transactional
    public Servicio marcarCobroTotal(int mesa) {
        Servicio servicio = obtenerServicioAbiertoPorMesa(mesa)
                .orElseThrow(() -> new RuntimeException("No hay un servicio abierto para la mesa"));

        sincronizarCobrosPersona(servicio);
        for (CobroPersona cobroPersona : servicio.getCobrosPersona()) {
            cobroPersona.setCobrado(true);
            cobroPersona.setFechaCobro(LocalDateTime.now());
        }
        actualizarEstadoCobro(servicio);
        servicio.setUltimaActividad(LocalDateTime.now());
        return servicioRepository.save(servicio);
    }

    @Transactional(readOnly = true)
    public List<Map<String, Object>> obtenerSolicitudesCobroPendientes() {
        List<Servicio> servicios = servicioRepository.findByEstadoCobroIn(
                List.of(EstadoCobro.PENDIENTE_COBRO, EstadoCobro.COBRANDO, EstadoCobro.COBRADO_PARCIAL)
        );

        List<Map<String, Object>> resultado = new ArrayList<>();
        for (Servicio servicio : servicios) {
            sincronizarCobrosPersona(servicio);
            resultado.add(construirResumenServicio(servicio, null, true));
        }
        return resultado;
    }

    @Transactional
    public void marcarActividadMesa(int mesa) {
        servicioRepository.findFirstByMesaAndEstado(mesa, EstadoServicio.Abierto).ifPresent(servicio -> {
            servicio.setUltimaActividad(LocalDateTime.now());
            servicioRepository.save(servicio);
        });
    }

    @Transactional
    public void cerrarServicioPorInactividad(int mesa) {
        servicioRepository.findByMesaAndEstado(mesa, EstadoServicio.Abierto)
                .forEach(servicio -> {
                    if (estaInactivo(servicio)) {
                        servicio.setEstado(EstadoServicio.Cerrado);
                        servicioRepository.save(servicio);
                    }
                });
    }

    public Map<String, Object> construirResumenServicio(Servicio servicio, Integer personaActual, boolean incluirDetalleCompleto) {
        sincronizarCobrosPersona(servicio);

        List<Map<String, Object>> pedidos = servicio.getPedidos().stream()
                .sorted(Comparator.comparing(Pedido::getFechaHora, Comparator.nullsLast(Comparator.naturalOrder())))
                .map(pedido -> {
                    Map<String, Object> item = new LinkedHashMap<>();
                    item.put("id", pedido.getId());
                    item.put("mesa", pedido.getMesa());
                    item.put("estado", pedido.getEstado());
                    item.put("fechaHora", pedido.getFechaHora());
                    item.put("persona", pedido.getPersona() != null ? pedido.getPersona() : 1);
                    item.put("plato", pedido.getPlato());
                    item.put("esMenu", pedido.isEsMenu());
                    Double pp = pedido.getPlato() != null ? pedido.getPlato().getPrecio() : null;
                    double importe = pedido.getPrecioUnitario() > 0
                            ? pedido.getPrecioUnitario()
                            : (pp != null ? pp : 0.0);
                    item.put("importe", importe);
                    return item;
                })
                .toList();

        Map<Integer, Map<String, Object>> totalesPorPersona = new TreeMap<>();
        for (Pedido pedido : servicio.getPedidos()) {
            if (pedido.getPlato() == null) {
                continue;
            }
            int persona = pedido.getPersona() != null ? pedido.getPersona() : 1;
            Map<String, Object> detalle = totalesPorPersona.computeIfAbsent(persona, key -> {
                Map<String, Object> nuevo = new LinkedHashMap<>();
                nuevo.put("persona", key);
                nuevo.put("items", new ArrayList<Map<String, Object>>());
                nuevo.put("total", 0.0);
                nuevo.put("cobrado", false);
                return nuevo;
            });

            @SuppressWarnings("unchecked")
            List<Map<String, Object>> itemsPersona = (List<Map<String, Object>>) detalle.get("items");
            Double precioP = pedido.getPlato().getPrecio();
            double precioPedido = pedido.getPrecioUnitario() > 0 ? pedido.getPrecioUnitario() : (precioP != null ? precioP : 0.0);
            itemsPersona.add(Map.of(
                    "pedidoId", pedido.getId(),
                    "nombre", pedido.getPlato().getNombre(),
                    "precio", precioPedido,
                    "estado", pedido.getEstado(),
                    "esMenu", pedido.isEsMenu()
            ));
            detalle.put("total", (Double) detalle.get("total") + precioPedido);
        }

        for (CobroPersona cobroPersona : servicio.getCobrosPersona()) {
            Map<String, Object> detalle = totalesPorPersona.computeIfAbsent(cobroPersona.getPersona(), key -> {
                Map<String, Object> nuevo = new LinkedHashMap<>();
                nuevo.put("persona", key);
                nuevo.put("items", new ArrayList<Map<String, Object>>());
                nuevo.put("total", cobroPersona.getImporte() != null ? cobroPersona.getImporte() : 0.0);
                return nuevo;
            });
            detalle.put("cobrado", cobroPersona.isCobrado());
            detalle.put("fechaCobro", cobroPersona.getFechaCobro());
        }

        double totalMesa = totalesPorPersona.values().stream()
                .mapToDouble(item -> ((Double) item.getOrDefault("total", 0.0)))
                .sum();

        double subtotalPersonaActual = personaActual != null && totalesPorPersona.containsKey(personaActual)
                ? (Double) totalesPorPersona.get(personaActual).getOrDefault("total", 0.0)
                : totalMesa;

        Map<String, Object> resumen = new LinkedHashMap<>();
        resumen.put("servicioId", servicio.getId());
        resumen.put("mesa", servicio.getMesa());
        resumen.put("estadoServicio", servicio.getEstado());
        resumen.put("estadoCobro", servicio.getEstadoCobro());
        resumen.put("metodoPagoSolicitado", servicio.getMetodoPagoSolicitado());
        resumen.put("fechaSolicitudCobro", servicio.getFechaSolicitudCobro());
        resumen.put("personaActual", personaActual);
        resumen.put("subtotalPersonaActual", subtotalPersonaActual);
        resumen.put("totalMesa", totalMesa);
        resumen.put("pedidos", pedidos);
        resumen.put("totalesPorPersona", new ArrayList<>(totalesPorPersona.values()));
        resumen.put("mostrarDesgloseCompleto", incluirDetalleCompleto);
        return resumen;
    }

  public String construirTicketHtml(Servicio servicio, Integer personaActual, boolean incluirDetalleCompleto, String nombreRestaurante) {

    Map<String, Object> resumen = construirResumenServicio(servicio, personaActual, incluirDetalleCompleto);

    @SuppressWarnings("unchecked")
    List<Map<String, Object>> totalesPorPersona =
            (List<Map<String, Object>>) resumen.get("totalesPorPersona");

    String fecha = LocalDateTime.now()
            .format(java.time.format.DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm"));

    String metodoPago = servicio.getMetodoPagoSolicitado() != null
            ? servicio.getMetodoPagoSolicitado().toString()
            : "Sin solicitar";

    StringBuilder html = new StringBuilder();

    html.append("<!doctype html><html><head><meta charset='utf-8'>")

        .append("<style>")

        /* IMPRESIÓN REAL */
        .append("@page { size: 80mm; margin: 0; }")

        .append("body {")
        .append("font-family: monospace;")
        .append("font-size:13px;")
        .append("margin:0;")
        .append("padding:6mm;")
        .append("width:80mm;")
        .append("color:#000;")
        .append("}")

        /* CONTENEDOR (evita corte inferior) */
        .append(".container { padding-bottom:10mm; }")

        /* CABECERA */
        .append(".center { text-align:center; }")
        .append(".bold { font-weight:bold; }")

        /* SEPARADORES */
        .append(".sep {")
        .append("border-top:1px dashed #000;")
        .append("margin:6px 0;")
        .append("}")

        /* LÍNEAS ALINEADAS */
        .append(".line {")
        .append("display:flex;")
        .append("justify-content:space-between;")
        .append("}")

        .append(".line span:first-child {")
        .append("max-width:70%;")
        .append("word-break:break-word;")
        .append("}")

        /* TOTAL */
        .append(".total {")
        .append("font-size:15px;")
        .append("font-weight:bold;")
        .append("}")

        /* FOOTER */
        .append(".footer {")
        .append("text-align:center;")
        .append("margin-top:10px;")
        .append("font-size:11px;")
        .append("}")

        .append("</style></head><body>")
        .append("<div class='container'>");

    // CABECERA
    html.append("<div class='center bold'>")
        .append(escapeHtml(nombreRestaurante))
        .append("</div>")

        .append("<div class='center'>Mesa ")
        .append(servicio.getMesa())
        .append("</div>")

        .append("<div class='center'>")
        .append(fecha)
        .append("</div>")

        .append("<div class='center'>Pago: ")
        .append(escapeHtml(metodoPago))
        .append("</div>")

        .append("<div class='sep'></div>");

    // PERSONAS
    for (Map<String, Object> persona : totalesPorPersona) {

        @SuppressWarnings("unchecked")
        List<Map<String, Object>> items =
                (List<Map<String, Object>>) persona.get("items");

        double totalPersona = persona.get("total") instanceof Number n ? n.doubleValue() : 0.0;

        html.append("<div class='bold'>Persona ")
            .append(persona.get("persona"))
            .append("</div>");

        for (Map<String, Object> item : items) {

            String nombre = escapeHtml(String.valueOf(item.get("nombre")));
            double precio = item.get("precio") instanceof Number n ? n.doubleValue() : 0.0;

            html.append("<div class='line'>")
                .append("<span>").append(nombre).append("</span>")
                .append("<span>").append(String.format(Locale.US, "%.2f€", precio)).append("</span>")
                .append("</div>");
        }

        html.append("<div class='sep'></div>");

        html.append("<div class='line bold'>")
            .append("<span>Subtotal</span>")
            .append("<span>")
            .append(String.format(Locale.US, "%.2f€", totalPersona))
            .append("</span>")
            .append("</div>");

        html.append("<div class='sep'></div>");
    }

    // TOTAL
    double totalMesa = (Double) resumen.get("totalMesa");

    html.append("<div class='line total'>")
        .append("<span>TOTAL</span>")
        .append("<span>")
        .append(String.format(Locale.US, "%.2f€", totalMesa))
        .append("</span>")
        .append("</div>");

    // FOOTER
    html.append("<div class='sep'></div>")
        .append("<div class='footer'>Gracias por su visita</div>")
        .append("<div class='footer'>Resumen no fiscal</div>");

    html.append("</div></body></html>");

    return html.toString();
}
    @Transactional
    public void cerrarServicioPorMesa(int mesa) {
        servicioRepository.findByMesaAndEstado(mesa, Servicio.EstadoServicio.Abierto)
                .forEach(servicio -> {
                    if (servicio.getEstadoCobro() == EstadoCobro.PENDIENTE_COBRO
                            || servicio.getEstadoCobro() == EstadoCobro.COBRANDO
                            || servicio.getEstadoCobro() == EstadoCobro.COBRADO_PARCIAL) {
                        throw new RuntimeException("No puedes cerrar la mesa con un cobro pendiente");
                    }
                    servicio.setEstado(Servicio.EstadoServicio.Cerrado);
                    servicioRepository.save(servicio);
                });
    }

    private MetodoPagoSolicitado parseMetodoPago(String metodoPago) {
        if (metodoPago == null || metodoPago.isBlank()) {
            throw new RuntimeException("Metodo de pago requerido");
        }
        try {
            return MetodoPagoSolicitado.valueOf(metodoPago.trim().toUpperCase(Locale.ROOT));
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Metodo de pago invalido");
        }
    }

    private void sincronizarCobrosPersona(Servicio servicio) {
        Map<Integer, Double> importesPorPersona = new TreeMap<>();
        for (Pedido pedido : servicio.getPedidos()) {
            if (pedido.getPlato() == null) {
                continue;
            }
            int persona = pedido.getPersona() != null ? pedido.getPersona() : 1;
            Double precioPlato = pedido.getPlato().getPrecio();
            double precioPed = pedido.getPrecioUnitario() > 0 ? pedido.getPrecioUnitario() : (precioPlato != null ? precioPlato : 0.0);
            if (precioPed > 0) importesPorPersona.merge(persona, precioPed, Double::sum);
        }

        Map<Integer, CobroPersona> existentes = new HashMap<>();
        for (CobroPersona cobroPersona : servicio.getCobrosPersona()) {
            existentes.put(cobroPersona.getPersona(), cobroPersona);
        }

        servicio.getCobrosPersona().clear();
        for (Map.Entry<Integer, Double> entry : importesPorPersona.entrySet()) {
            CobroPersona cobroPersona = existentes.getOrDefault(entry.getKey(), new CobroPersona());
            cobroPersona.setServicio(servicio);
            cobroPersona.setPersona(entry.getKey());
            cobroPersona.setImporte(entry.getValue());
            if (!cobroPersona.isCobrado()) {
                cobroPersona.setFechaCobro(null);
            }
            servicio.getCobrosPersona().add(cobroPersona);
        }
        actualizarEstadoCobro(servicio);
    }

    private void actualizarEstadoCobro(Servicio servicio) {
        if (servicio.getMetodoPagoSolicitado() == null) {
            servicio.setEstadoCobro(EstadoCobro.SIN_SOLICITUD);
            return;
        }

        if (servicio.getCobrosPersona().isEmpty()) {
            servicio.setEstadoCobro(EstadoCobro.PENDIENTE_COBRO);
            return;
        }

        boolean todosCobrados = servicio.getCobrosPersona().stream().allMatch(CobroPersona::isCobrado);
        boolean algunoCobrado = servicio.getCobrosPersona().stream().anyMatch(CobroPersona::isCobrado);

        if (todosCobrados) {
            servicio.setEstadoCobro(EstadoCobro.COBRADO_TOTAL);
        } else if (algunoCobrado) {
            servicio.setEstadoCobro(EstadoCobro.COBRADO_PARCIAL);
        } else if (servicio.getEstadoCobro() == EstadoCobro.COBRANDO) {
            servicio.setEstadoCobro(EstadoCobro.COBRANDO);
        } else {
            servicio.setEstadoCobro(EstadoCobro.PENDIENTE_COBRO);
        }
    }

    private String escapeHtml(String text) {
        return text == null ? "" : text
                .replace("&", "&amp;")
                .replace("<", "&lt;")
                .replace(">", "&gt;");
    }

    private boolean estaInactivo(Servicio servicio) {
        LocalDateTime referencia = servicio.getUltimaActividad();
        return referencia != null && referencia.plusMinutes(MINUTOS_INACTIVIDAD_CIERRE).isBefore(LocalDateTime.now());
    }
}
