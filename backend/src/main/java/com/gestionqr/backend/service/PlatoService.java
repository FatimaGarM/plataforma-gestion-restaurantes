package com.gestionqr.backend.service;

import com.gestionqr.backend.model.Plato;
import com.gestionqr.backend.repository.PlatoRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

/**
 * Servicio con la lógica de negocio de platos.
 */
@Service
public class PlatoService {

    @Autowired
    private PlatoRepository platoRepository;

    @Autowired
    private ArchivoService archivoService;

    public List<Plato> obtenerPlatos() {
        return platoRepository.findAll();
    }

    public Optional<Plato> obtenerPlatoById(Long id) {
        return platoRepository.findById(id);
    }

    public Plato crearPlato(Plato plato) {
        return platoRepository.save(plato);
    }

    public Plato crearPlatoConImagen(
            String nombre,
            String nombreEn,
            String descripcion,
            String descripcionEn,
            Double precio,
            String tipo,
            Boolean disponible,
            Boolean esNovedad,
            MultipartFile imagen
    ) throws Exception {

        String nombreArchivo = archivoService.guardarImagenPlato(imagen);

        Plato plato = new Plato();
        plato.setNombre(nombre);
        plato.setNombreEn(nombreEn);
        plato.setDescripcion(descripcion);
        plato.setDescripcionEn(descripcionEn);
        plato.setPrecio(precio);
        plato.setTipo(Plato.TipoPlato.valueOf(tipo));
        plato.setDisponible(disponible);
        plato.setEsNovedad(esNovedad != null && esNovedad);
        plato.setFechaCreacion(LocalDate.now());
        plato.setImagen(nombreArchivo);

        return platoRepository.save(plato);
    }

    public Plato actualizarPlato(
            Long id,
            String nombre,
            String nombreEn,
            String descripcion,
            String descripcionEn,
            Double precio,
            String tipo,
            Boolean disponible,
            Boolean esNovedad,
            MultipartFile imagen
    ) throws Exception {

        Plato plato = platoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Plato no encontrado"));

        plato.setNombre(nombre);
        plato.setNombreEn(nombreEn);
        plato.setDescripcion(descripcion);
        plato.setDescripcionEn(descripcionEn);
        plato.setPrecio(precio);
        plato.setTipo(Plato.TipoPlato.valueOf(tipo));
        plato.setDisponible(disponible);
        plato.setEsNovedad(esNovedad != null && esNovedad);
        if (plato.getFechaCreacion() == null) plato.setFechaCreacion(LocalDate.now());

        if (imagen != null && !imagen.isEmpty()) {

            archivoService.eliminarImagenPlato(plato.getImagen());

            String nombreArchivo = archivoService.guardarImagenPlato(imagen);
            plato.setImagen(nombreArchivo);
        }

        return platoRepository.save(plato);
    }

    public Plato toggleDisponible(Long id) {
        Plato plato = platoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Plato no encontrado"));

        plato.setDisponible(!plato.getDisponible());
        return platoRepository.save(plato);
    }

    public void borrarPlato(Long id) throws Exception {

        Plato plato = platoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Plato no encontrado"));

        archivoService.eliminarImagenPlato(plato.getImagen());

        platoRepository.deleteById(id);
    }
}