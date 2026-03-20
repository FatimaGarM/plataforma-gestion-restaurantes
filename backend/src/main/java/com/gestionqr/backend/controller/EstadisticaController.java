package com.gestionqr.backend.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.gestionqr.backend.service.EstadisticaService;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/estadisticas")
public class EstadisticaController {

    @Autowired
    private EstadisticaService estadisticaService;

    @GetMapping
    public Map<String, Object> obtenerEstadisticas() {
        return estadisticaService.calcularEstadisticas();
    }
}
