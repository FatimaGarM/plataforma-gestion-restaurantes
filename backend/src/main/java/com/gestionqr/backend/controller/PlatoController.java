package com.gestionqr.backend.controller;

import com.gestionqr.backend.model.Plato;
import com.gestionqr.backend.service.PlatoService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

/**
 * Controlador REST para la gestión de platos.
 * Solo recibe peticiones y delega en el servicio.
 */
@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/platos")
public class PlatoController {

    @Autowired
    private PlatoService platoService;

    @GetMapping
    public List<Plato> obtenerPlatos() {
        return platoService.obtenerPlatos();
    }

    @GetMapping("/{id}")
    public Optional<Plato> obtenerPlatoById(@PathVariable Long id) {
        return platoService.obtenerPlatoById(id);
    }

    @PostMapping
    public Plato crearPlato(@RequestBody Plato plato) {
        return platoService.crearPlato(plato);
    }

    @PostMapping("/con-imagen")
    public Plato crearPlatoConImagen(
            @RequestParam String nombre,
            @RequestParam(required = false) String nombreEn,
            @RequestParam String descripcion,
            @RequestParam(required = false) String descripcionEn,
            @RequestParam Double precio,
            @RequestParam String tipo,
            @RequestParam(required = false, defaultValue = "true") Boolean disponible,
            @RequestParam(required = false, defaultValue = "false") Boolean esNovedad,
            @RequestParam(name = "imagen", required = false) MultipartFile imagen
    ) throws Exception {

        return platoService.crearPlatoConImagen(
                nombre,
                nombreEn,
                descripcion,
                descripcionEn,
                precio,
                tipo,
                disponible,
                esNovedad,
                imagen
        );
    }

    @PutMapping("/{id}")
    public Plato actualizarPlato(
            @PathVariable Long id,
            @RequestParam String nombre,
            @RequestParam(required = false) String nombreEn,
            @RequestParam String descripcion,
            @RequestParam(required = false) String descripcionEn,
            @RequestParam Double precio,
            @RequestParam String tipo,
            @RequestParam Boolean disponible,
            @RequestParam(required = false, defaultValue = "false") Boolean esNovedad,
            @RequestParam(name = "imagen", required = false) MultipartFile imagen
    ) throws Exception {

        return platoService.actualizarPlato(
                id,
                nombre,
                nombreEn,
                descripcion,
                descripcionEn,
                precio,
                tipo,
                disponible,
                esNovedad,
                imagen
        );
    }

    @PutMapping("/{id}/disponible")
    public Plato toggleDisponible(@PathVariable Long id) {
        return platoService.toggleDisponible(id);
    }

    @DeleteMapping("/{id}")
    public void borrarPlato(@PathVariable Long id) throws Exception {
        platoService.borrarPlato(id);
    }
}