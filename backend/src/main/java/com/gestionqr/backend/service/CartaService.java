package com.gestionqr.backend.service;

import com.gestionqr.backend.model.Carta;
import com.gestionqr.backend.model.ItemSeccion;
import com.gestionqr.backend.model.Plato;
import com.gestionqr.backend.model.SeccionCarta;
import com.gestionqr.backend.model.repository.CartaRepository;
import com.gestionqr.backend.model.repository.PlatoRepository;
import com.gestionqr.backend.model.repository.SeccionCartaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
public class CartaService {

    @Autowired
    private CartaRepository cartaRepository;

    @Autowired
    private SeccionCartaRepository seccionCartaRepository;

    @Autowired
    private PlatoRepository platoRepository;

    @Autowired
    private ArchivoService archivoService;

    public List<Carta> listar() {
        return cartaRepository.findAll();
    }

    public Carta obtener(Long id) {
        return cartaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Carta no encontrada"));
    }

    public Carta obtenerCartaActiva() {
        return cartaRepository.findByActivaTrue()
                .orElseThrow(() -> new RuntimeException("No hay carta activa"));
    }

    public Carta crear(String nombre) {
        Carta carta = new Carta();
        carta.setNombre(nombre);
        return cartaRepository.save(carta);
    }

    public Carta renombrar(Long id, String nombre) {
        Carta carta = obtener(id);
        carta.setNombre(nombre);
        return cartaRepository.save(carta);
    }

    public Carta subirImagen(Long id, MultipartFile imagen) throws Exception {
        Carta carta = obtener(id);
        if (carta.getImagenBanner() != null && !carta.getImagenBanner().isBlank()) {
            archivoService.eliminarImagenCarta(carta.getImagenBanner());
        }
        String nombreArchivo = archivoService.guardarImagenCarta(imagen);
        carta.setImagenBanner(nombreArchivo);
        return cartaRepository.save(carta);
    }

    public void eliminar(Long id) {
        if (!cartaRepository.existsById(id)) {
            throw new RuntimeException("Carta no encontrada");
        }
        cartaRepository.deleteById(id);
    }

    public Carta añadirSeccion(Long cartaId, String nombre, String nombreEn) {
        Carta carta = obtener(cartaId);
        SeccionCarta seccion = new SeccionCarta();
        seccion.setNombre(nombre);
        seccion.setNombreEn(nombreEn != null ? nombreEn : "");
        seccion.setOrden(carta.getSecciones().size());
        seccion.setCarta(carta);
        carta.getSecciones().add(seccion);
        return cartaRepository.save(carta);
    }

    public SeccionCarta renombrarSeccion(Long cartaId, Long seccionId, String nombre, String nombreEn) {
        SeccionCarta seccion = seccionCartaRepository.findById(seccionId)
                .orElseThrow(() -> new RuntimeException("Sección no encontrada"));
        if (!seccion.getCarta().getId().equals(cartaId)) {
            throw new IllegalArgumentException("La sección no pertenece a esta carta");
        }
        seccion.setNombre(nombre);
        seccion.setNombreEn(nombreEn != null ? nombreEn : "");
        return seccionCartaRepository.save(seccion);
    }

    public Carta eliminarSeccion(Long cartaId, Long seccionId) {
        Carta carta = obtener(cartaId);
        carta.getSecciones().removeIf(s -> s.getId().equals(seccionId));
        return cartaRepository.save(carta);
    }

    public Carta añadirItem(Long cartaId, Long seccionId, Long platoId) {
        SeccionCarta seccion = seccionCartaRepository.findById(seccionId)
                .orElseThrow(() -> new RuntimeException("Sección no encontrada"));
        Plato plato = platoRepository.findById(platoId)
                .orElseThrow(() -> new RuntimeException("Plato no encontrado"));

        boolean yaExiste = seccion.getItems().stream()
                .anyMatch(item -> item.getPlato().getId().equals(plato.getId()));
        if (yaExiste) {
            throw new IllegalStateException("El plato ya existe en esta sección");
        }

        ItemSeccion item = new ItemSeccion();
        item.setPlato(plato);
        item.setOrden(seccion.getItems().size());
        item.setSeccion(seccion);
        seccion.getItems().add(item);
        seccionCartaRepository.save(seccion);

        return obtener(cartaId);
    }

    public Carta eliminarItem(Long cartaId, Long seccionId, Long itemId) {
        SeccionCarta seccion = seccionCartaRepository.findById(seccionId)
                .orElseThrow(() -> new RuntimeException("Sección no encontrada"));
        seccion.getItems().removeIf(item -> item.getId().equals(itemId));
        for (int i = 0; i < seccion.getItems().size(); i++) {
            seccion.getItems().get(i).setOrden(i);
        }
        seccionCartaRepository.save(seccion);
        return obtener(cartaId);
    }

    public Carta moverItem(Long cartaId, Long seccionId, Long itemId, String direccion) {
        SeccionCarta seccion = seccionCartaRepository.findById(seccionId)
                .orElseThrow(() -> new RuntimeException("Sección no encontrada"));
        List<ItemSeccion> items = seccion.getItems();
        int idx = -1;
        for (int i = 0; i < items.size(); i++) {
            if (items.get(i).getId().equals(itemId)) { idx = i; break; }
        }
        if (idx == -1) {
            throw new RuntimeException("Item no encontrado");
        }

        if ("subir".equals(direccion) && idx > 0) {
            ItemSeccion tmp = items.get(idx - 1);
            items.set(idx - 1, items.get(idx));
            items.set(idx, tmp);
        } else if ("bajar".equals(direccion) && idx < items.size() - 1) {
            ItemSeccion tmp = items.get(idx + 1);
            items.set(idx + 1, items.get(idx));
            items.set(idx, tmp);
        }

        for (int i = 0; i < items.size(); i++) items.get(i).setOrden(i);
        seccionCartaRepository.save(seccion);
        return obtener(cartaId);
    }

    @Transactional
    public Carta activar(Long id) {
        Carta carta = obtener(id);
        cartaRepository.desactivarTodas();
        carta.setActiva(true);
        return cartaRepository.save(carta);
    }
}
