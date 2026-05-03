package com.gestionqr.backend.controller;

import com.gestionqr.backend.model.Servicio;
import com.gestionqr.backend.request.CrearServicioRequest;
import com.gestionqr.backend.service.LlamadaCamareraService;
import com.gestionqr.backend.service.SesionMesaService;
import com.gestionqr.backend.service.ServicioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/servicios")
public class ServicioController {

    @Autowired
    private ServicioService servicioService;

    @Autowired
    private SesionMesaService sesionMesaService;

    @Autowired
    private LlamadaCamareraService llamadaService;

    @PostMapping
    public Servicio crearServicio(@RequestBody CrearServicioRequest request) {
        return servicioService.crearServicio(request.getPlatosIds(), request.getMesa());
    }

    @GetMapping("/mesas-con-sesion")
    public List<Integer> mesasConSesionActiva() {
        return sesionMesaService.obtenerMesasConSesionActiva();
    }

    @GetMapping("/cobros-pendientes")
    public List<Map<String, Object>> obtenerCobrosPendientes() {
        return servicioService.obtenerSolicitudesCobroPendientes();
    }

    @PutMapping("/{mesa}/cobro/atender")
    public ResponseEntity<?> atenderCobro(@PathVariable int mesa) {
        try {
            Servicio servicio = servicioService.marcarCobroEnCurso(mesa);
            sesionMesaService.marcarActividadPorMesa(mesa);
            return ResponseEntity.ok(servicioService.construirResumenServicio(servicio, null, true));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{mesa}/cobro/persona/{persona}")
    public ResponseEntity<?> marcarCobroPersona(
            @PathVariable int mesa,
            @PathVariable int persona,
            @RequestBody(required = false) Map<String, Object> body
    ) {
        boolean cobrado = true;
        if (body != null && body.get("cobrado") instanceof Boolean valor) {
            cobrado = valor;
        }

        try {
            Servicio servicio = servicioService.marcarCobroPersona(mesa, persona, cobrado);
            sesionMesaService.marcarActividadPorMesa(mesa);
            return ResponseEntity.ok(servicioService.construirResumenServicio(servicio, null, true));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{mesa}/cobro/total")
    public ResponseEntity<?> marcarCobroTotal(@PathVariable int mesa) {
        try {
            Servicio servicio = servicioService.marcarCobroTotal(mesa);
            sesionMesaService.marcarActividadPorMesa(mesa);
            return ResponseEntity.ok(servicioService.construirResumenServicio(servicio, null, true));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{mesa}/cerrar")
    public ResponseEntity<?> cerrarMesa(@PathVariable int mesa) {
        try {
            servicioService.cerrarServicioPorMesa(mesa);
            sesionMesaService.cerrarMesa(mesa);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/llamadas-pendientes")
    public List<Map<String, Object>> obtenerLlamadasPendientes() {
        return llamadaService.obtenerPendientes();
    }

    @PutMapping("/llamadas/{id}/atender")
    public ResponseEntity<?> atenderLlamada(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(llamadaService.atender(id));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
