package com.gestionqr.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.gestionqr.backend.model.Servicio;
import com.gestionqr.backend.request.CrearServicioRequest;
import com.gestionqr.backend.service.ServicioService;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/servicios")
public class ServicioController {

    @Autowired
    private ServicioService servicioService;

    @PostMapping
    public Servicio crearServicio(@RequestBody CrearServicioRequest request) {
        return servicioService.crearServicio(request.getPlatosIds(), request.getMesa());
    }
}