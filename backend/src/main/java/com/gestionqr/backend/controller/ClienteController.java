package com.gestionqr.backend.controller;

import com.gestionqr.backend.model.Carta;
import com.gestionqr.backend.model.ConfiguracionRestaurante;
import com.gestionqr.backend.model.Pedido;
import com.gestionqr.backend.model.Pedido.EstadoPedido;
import com.gestionqr.backend.model.Servicio;
import com.gestionqr.backend.model.Servicio.EstadoServicio;
import com.gestionqr.backend.model.SesionMesa;
import com.gestionqr.backend.model.repository.CartaRepository;
import com.gestionqr.backend.model.repository.PlatoRepository;
import com.gestionqr.backend.model.repository.ServicioRepository;
import com.gestionqr.backend.service.ConfiguracionRestauranteService;
import com.gestionqr.backend.service.SesionMesaService;
import com.gestionqr.backend.service.ServicioService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/publica")
public class ClienteController {

    private final SesionMesaService sesionMesaService;
    private final CartaRepository cartaRepository;
    private final ConfiguracionRestauranteService configuracionService;
    private final ServicioRepository servicioRepository;
    private final PlatoRepository platoRepository;
    private final ServicioService servicioService;

    public ClienteController(
            SesionMesaService sesionMesaService,
            CartaRepository cartaRepository,
            ConfiguracionRestauranteService configuracionService,
            ServicioRepository servicioRepository,
            PlatoRepository platoRepository,
            ServicioService servicioService
    ) {
        this.sesionMesaService = sesionMesaService;
        this.cartaRepository = cartaRepository;
        this.configuracionService = configuracionService;
        this.servicioRepository = servicioRepository;
        this.platoRepository = platoRepository;
        this.servicioService = servicioService;
    }

    @GetMapping("/sesion")
    public ResponseEntity<Map<String, Object>> obtenerSesion(
            @RequestParam int mesa,
            @RequestParam(required = false) String codigo
    ) {
        servicioService.cerrarServicioPorInactividad(mesa);
        SesionMesaService.ResultadoSesion resultado = sesionMesaService.solicitarSesion(mesa, codigo);

        if (resultado.codigoRequerido()) {
            if ("INDIVIDUAL".equals(resultado.modo())) {
                return ResponseEntity.status(403).body(Map.of(
                        "error", "MODO_INDIVIDUAL",
                        "mesa", mesa
                ));
            }

            String error = resultado.codigoInvalido() ? "CODIGO_INVALIDO" : "CODIGO_REQUERIDO";
            return ResponseEntity.status(403).body(Map.of(
                    "error", error,
                    "mesa", mesa
            ));
        }

        SesionMesa sesion = resultado.sesion();
        return ResponseEntity.ok(Map.of(
                "token", sesion.getToken(),
                "mesa", sesion.getMesa(),
                "codigoAcceso", sesion.getCodigoAcceso(),
                "esNueva", resultado.esNueva(),
                "modo", sesion.getModo()
        ));
    }

    @GetMapping("/codigo")
    public ResponseEntity<?> obtenerCodigoSesion(@RequestParam String token) {
        Optional<SesionMesa> sesionOpt = sesionMesaService.validarToken(token);
        if (sesionOpt.isEmpty()) {
            return ResponseEntity.status(401).body(Map.of("error", "Sesion invalida"));
        }

        SesionMesa sesion = sesionOpt.get();
        return ResponseEntity.ok(Map.of(
                "mesa", sesion.getMesa(),
                "codigoAcceso", sesion.getCodigoAcceso(),
                "modo", sesion.getModo()
        ));
    }

    @PostMapping("/sesion/modo")
    public ResponseEntity<?> establecerModo(@RequestBody Map<String, String> body) {
        try {
            SesionMesa sesion = sesionMesaService.establecerModo(body.get("token"), body.get("modo"));
            return ResponseEntity.ok(Map.of(
                    "exito", true,
                    "modo", sesion.getModo()
            ));
        } catch (IllegalArgumentException e) {
            if ("SESION_INVALIDA".equals(e.getMessage())) {
                return ResponseEntity.status(401).body(Map.of("error", "Sesion invalida"));
            }
            return ResponseEntity.badRequest().body(Map.of("error", "Modo invalido"));
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(Map.of("error", "El modo ya fue establecido"));
        }
    }

    @PostMapping("/sesion/nueva-persona")
    public ResponseEntity<?> obtenerNuevaPersona(@RequestBody Map<String, String> body) {
        try {
            int nuevaPersona = sesionMesaService.asignarNuevaPersona(body.get("token"));
            return ResponseEntity.ok(Map.of("personaId", nuevaPersona));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(401).body(Map.of("error", "Sesion invalida"));
        }
    }

    @GetMapping("/carta")
    public ResponseEntity<Carta> obtenerCartaActiva() {
        return cartaRepository.findByActivaTrue()
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/configuracion")
    public ConfiguracionRestaurante obtenerConfiguracion() {
        return configuracionService.obtenerConfiguracion();
    }

    @PostMapping("/pedidos")
    public ResponseEntity<?> crearPedido(@RequestBody Map<String, Object> body) {
        String token = (String) body.get("token");
        if (token == null || token.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Token requerido"));
        }

        Optional<SesionMesa> sesionOpt = sesionMesaService.validarToken(token);
        if (sesionOpt.isEmpty()) {
            return ResponseEntity.status(401).body(Map.of("error", "Sesion invalida o expirada"));
        }

        List<Map<String, Object>> items = extraerItems(body);
        if (items.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Sin platos en el pedido"));
        }

        int mesa = sesionOpt.get().getMesa();
        Servicio servicio = servicioRepository
                .findFirstByMesaAndEstado(mesa, EstadoServicio.Abierto)
                .orElseGet(() -> {
                    Servicio nuevo = new Servicio();
                    nuevo.setEstado(EstadoServicio.Abierto);
                    nuevo.setMesa(mesa);
                    nuevo.setPedidos(new ArrayList<>());
                    return servicioRepository.save(nuevo);
                });

        List<Pedido> nuevos = new ArrayList<>();
        for (Map<String, Object> item : items) {
            Object platoIdRaw = item.get("platoId");
            Long platoId = extraerLong(platoIdRaw);
            if (platoId == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "Formato de plato invalido"));
            }

            var platoOpt = platoRepository.findById(platoId);
            if (platoOpt.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "No existe el plato con id " + platoId));
            }

            Pedido pedido = new Pedido();
            pedido.setMesa(mesa);
            pedido.setPlato(platoOpt.get());
            pedido.setEstado(EstadoPedido.Pendiente);
            pedido.setServicio(servicio);

            Integer persona = extraerInteger(item.get("persona"));
            if (persona != null) {
                pedido.setPersona(persona);
            }

            nuevos.add(pedido);
        }

        servicio.getPedidos().addAll(nuevos);
        Servicio guardado = servicioRepository.save(servicio);
        servicioService.marcarActividadMesa(mesa);
        sesionMesaService.marcarActividadPorMesa(mesa);
        return ResponseEntity.ok(guardado);
    }

    @GetMapping("/mis-pedidos")
    public ResponseEntity<?> misPedidos(@RequestParam String token) {
        Optional<SesionMesa> sesionOpt = sesionMesaService.validarToken(token);
        if (sesionOpt.isEmpty()) {
            return ResponseEntity.status(401).body(Map.of("error", "Sesion invalida"));
        }

        int mesa = sesionOpt.get().getMesa();
        List<Pedido> pedidos = servicioRepository
                .findFirstByMesaAndEstado(mesa, EstadoServicio.Abierto)
                .map(Servicio::getPedidos)
                .orElse(List.of());
        return ResponseEntity.ok(pedidos);
    }

    @GetMapping("/resumen")
    public ResponseEntity<?> obtenerResumenMesa(
            @RequestParam String token,
            @RequestParam(required = false) Integer persona
    ) {
        Optional<SesionMesa> sesionOpt = sesionMesaService.validarToken(token);
        if (sesionOpt.isEmpty()) {
            return ResponseEntity.status(401).body(Map.of("error", "Sesion invalida"));
        }

        SesionMesa sesion = sesionOpt.get();
        Optional<Servicio> servicioOpt = servicioRepository.findFirstByMesaAndEstado(sesion.getMesa(), EstadoServicio.Abierto);
        if (servicioOpt.isEmpty()) {
            Map<String, Object> resumenVacio = new LinkedHashMap<>();
            resumenVacio.put("mesa", sesion.getMesa());
            resumenVacio.put("modo", sesion.getModo());
            resumenVacio.put("personaActual", persona);
            resumenVacio.put("pedidos", List.of());
            resumenVacio.put("totalesPorPersona", List.of());
            resumenVacio.put("subtotalPersonaActual", 0.0);
            resumenVacio.put("totalMesa", 0.0);
            resumenVacio.put("estadoCobro", "SIN_SOLICITUD");
            resumenVacio.put("metodoPagoSolicitado", "");
            resumenVacio.put("fechaSolicitudCobro", null);
            return ResponseEntity.ok(resumenVacio);
        }

        Map<String, Object> resumen = servicioService.construirResumenServicio(
                servicioOpt.get(),
                persona,
                !"GRUPO".equals(sesion.getModo())
        );
        resumen.put("modo", sesion.getModo());
        return ResponseEntity.ok(resumen);
    }

    @PostMapping("/cobro/solicitar")
    public ResponseEntity<?> solicitarCobro(@RequestBody Map<String, String> body) {
        String token = body.get("token");
        Optional<SesionMesa> sesionOpt = sesionMesaService.validarToken(token);
        if (sesionOpt.isEmpty()) {
            return ResponseEntity.status(401).body(Map.of("error", "Sesion invalida"));
        }

        try {
            Servicio servicio = servicioService.solicitarCobro(sesionOpt.get().getMesa(), body.get("metodoPago"));
            sesionMesaService.marcarActividadPorMesa(sesionOpt.get().getMesa());
            return ResponseEntity.ok(servicioService.construirResumenServicio(servicio, extraerInteger(body.get("persona")), true));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping(value = "/ticket", produces = MediaType.TEXT_HTML_VALUE)
    public ResponseEntity<?> descargarTicket(
            @RequestParam String token,
            @RequestParam(required = false) Integer persona
    ) {
        Optional<SesionMesa> sesionOpt = sesionMesaService.validarToken(token);
        if (sesionOpt.isEmpty()) {
            return ResponseEntity.status(401).body("Sesion invalida");
        }

        int mesa = sesionOpt.get().getMesa();
        Optional<Servicio> servicioOpt = servicioRepository.findFirstByMesaAndEstado(mesa, EstadoServicio.Abierto);
        if (servicioOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("No hay consumo para generar ticket");
        }

        ConfiguracionRestaurante config = configuracionService.obtenerConfiguracion();
        String html = servicioService.construirTicketHtml(
                servicioOpt.get(),
                persona,
                !"GRUPO".equals(sesionOpt.get().getModo()),
                config.getNombreRestaurante() != null ? config.getNombreRestaurante() : "Restaurante"
        );
        return ResponseEntity.ok(html);
    }

    private List<Map<String, Object>> extraerItems(Map<String, Object> body) {
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

    private Integer extraerInteger(Object raw) {
        if (raw instanceof Number numero) {
            return numero.intValue();
        }
        if (raw instanceof String texto && !texto.isBlank()) {
            try {
                return Integer.parseInt(texto.trim());
            } catch (NumberFormatException ignored) {
                return null;
            }
        }
        return null;
    }

    private Long extraerLong(Object raw) {
        if (raw instanceof Number numero) {
            return numero.longValue();
        }
        if (raw instanceof String texto && !texto.isBlank()) {
            try {
                return Long.parseLong(texto.trim());
            } catch (NumberFormatException ignored) {
                return null;
            }
        }
        return null;
    }
}
