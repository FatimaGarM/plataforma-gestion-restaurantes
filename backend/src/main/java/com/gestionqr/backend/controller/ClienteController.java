package com.gestionqr.backend.controller;

import com.gestionqr.backend.model.Comensal;
import com.gestionqr.backend.model.ConfiguracionRestaurante;
import com.gestionqr.backend.model.LlamadaCamarero;
import com.gestionqr.backend.model.Servicio;
import com.gestionqr.backend.model.SesionMesa;
import com.gestionqr.backend.service.CartaService;
import com.gestionqr.backend.service.ClienteService;
import com.gestionqr.backend.service.ConfiguracionRestauranteService;
import com.gestionqr.backend.service.LlamadaCamareraService;
import com.gestionqr.backend.service.SesionMesaService;
import com.gestionqr.backend.service.ServicioService;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/publica")
public class ClienteController {

    private final SesionMesaService sesionMesaService;
    private final ConfiguracionRestauranteService configuracionService;
    private final ServicioService servicioService;
    private final LlamadaCamareraService llamadaService;
    private final CartaService cartaService;
    private final ClienteService clienteService;

    public ClienteController(
            SesionMesaService sesionMesaService,
            ConfiguracionRestauranteService configuracionService,
            ServicioService servicioService,
            LlamadaCamareraService llamadaService,
            CartaService cartaService,
            ClienteService clienteService
    ) {
        this.sesionMesaService = sesionMesaService;
        this.configuracionService = configuracionService;
        this.servicioService = servicioService;
        this.llamadaService = llamadaService;
        this.cartaService = cartaService;
        this.clienteService = clienteService;
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

    @PostMapping("/comensales")
    public ResponseEntity<?> registrarComensal(@RequestBody Map<String, Object> body) {
        String token = (String) body.get("token");
        Optional<SesionMesa> sesionOpt = sesionMesaService.validarToken(token);
        if (sesionOpt.isEmpty()) {
            return ResponseEntity.status(401).body(Map.of("error", "Sesion invalida"));
        }

        Comensal c = clienteService.registrarComensal(
                sesionOpt.get(),
                clienteService.extraerInteger(body.get("numero")),
                (String) body.get("nombre")
        );
        return ResponseEntity.ok(Map.of(
                "id", c.getId(),
                "numero", c.getNumero(),
                "nombre", c.getNombre() != null ? c.getNombre() : ""
        ));
    }

    @PostMapping("/llamada")
    public ResponseEntity<?> solicitarLlamada(@RequestBody Map<String, String> body) {
        String token = body.get("token");
        Optional<SesionMesa> sesionOpt = sesionMesaService.validarToken(token);
        if (sesionOpt.isEmpty()) {
            return ResponseEntity.status(401).body(Map.of("error", "Sesion invalida"));
        }

        SesionMesa sesion = sesionOpt.get();
        int mesa = sesion.getMesa();
        Servicio servicio = clienteService.obtenerOCrearServicioAbierto(mesa);

        String tipoStr = body.get("tipo");
        LlamadaCamarero.TipoLlamada tipo;
        try {
            tipo = LlamadaCamarero.TipoLlamada.valueOf(tipoStr);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Tipo de llamada invalido"));
        }

        LlamadaCamarero llamada = llamadaService.solicitar(servicio, sesion, tipo, body.get("metodoPago"));
        sesionMesaService.marcarActividadPorMesa(mesa);
        return ResponseEntity.ok(Map.of(
                "id", llamada.getId(),
                "tipo", llamada.getTipo(),
                "estado", llamada.getEstado(),
                "metodoPago", llamada.getMetodoPago() != null ? llamada.getMetodoPago() : ""
        ));
    }

    @GetMapping("/carta")
    public ResponseEntity<?> obtenerCartaActiva() {
        try {
            return ResponseEntity.ok(cartaService.obtenerCartaActiva());
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/configuracion")
    public ConfiguracionRestaurante obtenerConfiguracion() {
        return configuracionService.obtenerConfiguracion();
    }

    @GetMapping("/menu-hoy")
    public ResponseEntity<?> menuHoy() {
        return clienteService.obtenerMenuHoy()
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.noContent().build());
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

        List<Map<String, Object>> items = clienteService.extraerItems(body);
        if (items.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Sin platos en el pedido"));
        }

        try {
            SesionMesa sesion = sesionOpt.get();
            Servicio guardado = clienteService.crearPedido(sesion, items);
            servicioService.marcarActividadMesa(sesion.getMesa());
            sesionMesaService.marcarActividadPorMesa(sesion.getMesa());
            return ResponseEntity.ok(guardado);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (IllegalStateException e) {
            String msg = e.getMessage();
            if (msg != null && msg.startsWith("MENU_YA_PEDIDO:")) {
                Long comensalId = Long.parseLong(msg.split(":")[1]);
                return ResponseEntity.status(409).body(Map.of("error", "MENU_YA_PEDIDO", "comensalId", comensalId));
            }
            return ResponseEntity.badRequest().body(Map.of("error", msg));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/mis-pedidos")
    public ResponseEntity<?> misPedidos(@RequestParam String token) {
        Optional<SesionMesa> sesionOpt = sesionMesaService.validarToken(token);
        if (sesionOpt.isEmpty()) {
            return ResponseEntity.status(401).body(Map.of("error", "Sesion invalida"));
        }

        int mesa = sesionOpt.get().getMesa();
        List<?> pedidos = servicioService.obtenerServicioAbiertoPorMesa(mesa)
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
        Optional<Servicio> servicioOpt = servicioService.obtenerServicioAbiertoPorMesa(sesion.getMesa());

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
            int mesa = sesionOpt.get().getMesa();
            Servicio servicio = servicioService.solicitarCobro(mesa, body.get("metodoPago"));
            sesionMesaService.marcarActividadPorMesa(mesa);
            return ResponseEntity.ok(servicioService.construirResumenServicio(
                    servicio,
                    clienteService.extraerInteger(body.get("persona")),
                    true
            ));
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

        SesionMesa sesion = sesionOpt.get();
        Optional<Servicio> servicioOpt = servicioService.obtenerServicioAbiertoPorMesa(sesion.getMesa());
        if (servicioOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("No hay consumo para generar ticket");
        }

        ConfiguracionRestaurante config = configuracionService.obtenerConfiguracion();
        String html = servicioService.construirTicketHtml(
                servicioOpt.get(),
                persona,
                !"GRUPO".equals(sesion.getModo()),
                config.getNombreRestaurante() != null ? config.getNombreRestaurante() : "Restaurante"
        );
        return ResponseEntity.ok(html);
    }
}
