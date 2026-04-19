package com.gestionqr.backend.controller;

import com.gestionqr.backend.model.ConfiguracionRestaurante;
import com.gestionqr.backend.service.ConfiguracionRestauranteService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/configuracion")
public class ConfiguracionRestauranteController {

    @Autowired
    private ConfiguracionRestauranteService configuracionService;

    /**
     * Obtener la configuración actual del restaurante.
     */
    @GetMapping
    public ConfiguracionRestaurante obtenerConfiguracion() {
        return configuracionService.obtenerConfiguracion();
    }

    /**
     * Actualizar la configuración del restaurante.
     */
    @PutMapping
    public ConfiguracionRestaurante actualizarConfiguracion(
            @RequestParam String nombreRestaurante,
            @RequestParam(required = false) String telefono,
            @RequestParam(required = false) String direccion,
            @RequestParam(required = false) String emailContacto,
            @RequestParam String colorPrimario,
            @RequestParam String colorSecundario,
            @RequestParam(defaultValue = "es") String idiomaCarta,
            @RequestParam(name = "logo", required = false) MultipartFile logo,
            @RequestParam(name = "imagenFondo", required = false) MultipartFile imagenFondo
    ) throws Exception {

        return configuracionService.actualizarConfiguracion(
                nombreRestaurante,
                telefono,
                direccion,
                emailContacto,
                colorPrimario,
                colorSecundario,
                idiomaCarta,
                logo,
                imagenFondo
        );
    }
}
