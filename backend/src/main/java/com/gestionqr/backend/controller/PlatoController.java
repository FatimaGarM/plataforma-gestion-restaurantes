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
import java.util.Optional;

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

    @GetMapping("/{id}")
    public Optional<Plato> obtenerPlatoById(@PathVariable Long id) {
        return platoRepository.findById(id);
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
            @RequestParam Plato.TipoPlato tipo,
            @RequestParam Boolean disponible,
            @RequestParam("imagen") MultipartFile imagen) throws Exception {

        String nombreArchivo = System.currentTimeMillis() + "_" + imagen.getOriginalFilename();

        Path ruta = Paths.get("uploads/FotoPlatos/" + nombreArchivo);
        Files.createDirectories(ruta.getParent());
        Files.write(ruta, imagen.getBytes());

        Plato plato = new Plato();
        plato.setNombre(nombre);
        plato.setDescripcion(descripcion);
        plato.setPrecio(precio);
        plato.setImagen(nombreArchivo);


        plato.setTipo(tipo);
        plato.setDisponible(disponible);

        return platoRepository.save(plato);
    }

    @PutMapping("/{id}")
    public Plato actualizarPlato(
            @PathVariable Long id,
            @RequestParam String nombre,
            @RequestParam String descripcion,
            @RequestParam Double precio,
            @RequestParam Plato.TipoPlato tipo,
            @RequestParam Boolean disponible,
            @RequestParam(name = "imagen", required = false) MultipartFile imagen) throws Exception {

        Plato plato = platoRepository.findById(id).get();

        plato.setNombre(nombre);
        plato.setDescripcion(descripcion);
        plato.setPrecio(precio);

        plato.setTipo(tipo);
        plato.setDisponible(disponible);

        if (imagen != null && !imagen.isEmpty()) {

            String imagenAntigua = plato.getImagen();

            String nombreArchivo = System.currentTimeMillis() + "_" + imagen.getOriginalFilename();

            Path rutaNueva = Paths.get("uploads/FotoPlatos/" + nombreArchivo);
            Files.createDirectories(rutaNueva.getParent());
            Files.write(rutaNueva, imagen.getBytes());

            plato.setImagen(nombreArchivo);

            if (imagenAntigua != null) {
                Path rutaAntigua = Paths.get("uploads/FotoPlatos/" + imagenAntigua);
                Files.deleteIfExists(rutaAntigua);
            }
        }

        return platoRepository.save(plato);

    }

    @PutMapping("/{id}/disponible")
    public Plato cambiarDisponible(@PathVariable Long id) {

        Plato plato = platoRepository.findById(id).get();

        //aquí invertimos el valor
        plato.setDisponible(!plato.getDisponible());

        return platoRepository.save(plato);
    }

    @DeleteMapping("/{id}")
    public void borrarPlato(@PathVariable Long id) throws Exception {

        String nombreArchivo = platoRepository.findById(id).get().getImagen();

        if (nombreArchivo != null) {
            Path ruta = nombreArchivo.contains("/") || nombreArchivo.contains("\\")
                    ? Paths.get("uploads/" + nombreArchivo)
                    : Paths.get("uploads/FotoPlatos/" + nombreArchivo);
            Files.deleteIfExists(ruta);
        }

        platoRepository.deleteById(id);
    }
}