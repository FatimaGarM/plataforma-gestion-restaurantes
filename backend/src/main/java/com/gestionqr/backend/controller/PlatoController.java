package com.gestionqr.backend.controller;

import com.gestionqr.backend.model.Plato;
import com.gestionqr.backend.repository.PlatoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/platos")
public class PlatoController {

    @Autowired
    private PlatoRepository platoRepository;


    @GetMapping
    public List<Plato> obtenerPlatos() {
        return platoRepository.findAll();
    }


    @PostMapping
    public Plato crearPlato(@RequestBody Plato plato) {
        return platoRepository.save(plato);
    }


    @PostMapping("/con-imagen")
    public Plato crearPlatoConImagen(
            @RequestParam String nombre,
            @RequestParam String descripcion,
            @RequestParam Double precio,
            @RequestParam("imagen") MultipartFile imagen
    ) throws Exception {

        String nombreArchivo = System.currentTimeMillis() + "_" + imagen.getOriginalFilename();

        Path ruta = Paths.get("uploads/" + nombreArchivo);
        Files.createDirectories(ruta.getParent());
        Files.write(ruta, imagen.getBytes());

        Plato plato = new Plato();
        plato.setNombre(nombre);
        plato.setDescripcion(descripcion);
        plato.setPrecio(precio);
        plato.setImagen(nombreArchivo);

        return platoRepository.save(plato);
    }
}