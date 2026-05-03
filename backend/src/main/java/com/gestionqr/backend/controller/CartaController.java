package com.gestionqr.backend.controller;

import com.gestionqr.backend.model.Carta;
import com.gestionqr.backend.model.ItemSeccion;
import com.gestionqr.backend.model.Plato;
import com.gestionqr.backend.model.SeccionCarta;
import com.gestionqr.backend.model.repository.CartaRepository;
import com.gestionqr.backend.model.repository.PlatoRepository;
import com.gestionqr.backend.model.repository.SeccionCartaRepository;
import com.gestionqr.backend.service.ArchivoService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/cartas")
public class CartaController {

    @Autowired
    private CartaRepository cartaRepository;

    @Autowired
    private SeccionCartaRepository seccionCartaRepository;

    @Autowired
    private PlatoRepository platoRepository;

    @Autowired
    private ArchivoService archivoService;

    // ── CARTAS ────────────────────────────────────────────────────────────────

    @GetMapping
    public List<Carta> listar() {
        return cartaRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Carta> obtener(@PathVariable Long id) {
        return cartaRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Carta crear(@RequestBody Map<String, String> body) {
        Carta carta = new Carta();
        carta.setNombre(body.get("nombre"));
        return cartaRepository.save(carta);
    }

    @PutMapping("/{id}/nombre")
    public ResponseEntity<Carta> renombrar(@PathVariable Long id, @RequestBody Map<String, String> body) {
        return cartaRepository.findById(id).map(carta -> {
            carta.setNombre(body.get("nombre"));
            return ResponseEntity.ok(cartaRepository.save(carta));
        }).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/{id}/imagen")
    public ResponseEntity<Carta> subirImagen(@PathVariable Long id,
                                              @RequestParam("imagen") MultipartFile imagen) throws Exception {
        return cartaRepository.findById(id).map(carta -> {
            try {
                // Eliminar banner anterior si existe
                if (carta.getImagenBanner() != null && !carta.getImagenBanner().isBlank()) {
                    archivoService.eliminarImagenCarta(carta.getImagenBanner());
                }
                String nombreArchivo = archivoService.guardarImagenCarta(imagen);
                carta.setImagenBanner(nombreArchivo);
                return ResponseEntity.ok(cartaRepository.save(carta));
            } catch (Exception e) {
                throw new RuntimeException(e);
            }
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        if (!cartaRepository.existsById(id)) return ResponseEntity.notFound().build();
        cartaRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // ── SECCIONES ─────────────────────────────────────────────────────────────

    @PostMapping("/{cartaId}/secciones")
    public ResponseEntity<Carta> añadirSeccion(@PathVariable Long cartaId,
                                                @RequestBody Map<String, String> body) {
        return cartaRepository.findById(cartaId).map(carta -> {
            SeccionCarta seccion = new SeccionCarta();
            seccion.setNombre(body.get("nombre"));
            seccion.setNombreEn(body.getOrDefault("nombreEn", ""));
            seccion.setOrden(carta.getSecciones().size());
            seccion.setCarta(carta);
            carta.getSecciones().add(seccion);
            return ResponseEntity.ok(cartaRepository.save(carta));
        }).orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{cartaId}/secciones/{seccionId}")
    public ResponseEntity<SeccionCarta> renombrarSeccion(@PathVariable Long cartaId,
                                                          @PathVariable Long seccionId,
                                                          @RequestBody Map<String, String> body) {
        return seccionCartaRepository.findById(seccionId).map(seccion -> {
            if (!seccion.getCarta().getId().equals(cartaId)) return ResponseEntity.badRequest().<SeccionCarta>build();
            seccion.setNombre(body.get("nombre"));
            seccion.setNombreEn(body.getOrDefault("nombreEn", ""));
            return ResponseEntity.ok(seccionCartaRepository.save(seccion));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{cartaId}/secciones/{seccionId}")
    public ResponseEntity<Carta> eliminarSeccion(@PathVariable Long cartaId,
                                                  @PathVariable Long seccionId) {
        return cartaRepository.findById(cartaId).map(carta -> {
            carta.getSecciones().removeIf(s -> s.getId().equals(seccionId));
            return ResponseEntity.ok(cartaRepository.save(carta));
        }).orElse(ResponseEntity.notFound().build());
    }

    // ── ITEMS (platos en sección) ──────────────────────────────────────────────

    @PostMapping("/{cartaId}/secciones/{seccionId}/items")
    public ResponseEntity<Carta> añadirItem(@PathVariable Long cartaId,
                                             @PathVariable Long seccionId,
                                             @RequestBody Map<String, Long> body) {
        Optional<SeccionCarta> seccionOpt = seccionCartaRepository.findById(seccionId);
        Optional<Plato> platoOpt = platoRepository.findById(body.get("platoId"));

        if (seccionOpt.isEmpty() || platoOpt.isEmpty()) return ResponseEntity.notFound().build();

        SeccionCarta seccion = seccionOpt.get();
        Plato plato = platoOpt.get();

        // Evitar duplicados en la misma sección
        boolean yaExiste = seccion.getItems().stream()
                .anyMatch(item -> item.getPlato().getId().equals(plato.getId()));
        if (yaExiste) return ResponseEntity.badRequest().build();

        ItemSeccion item = new ItemSeccion();
        item.setPlato(plato);
        item.setOrden(seccion.getItems().size());
        item.setSeccion(seccion);
        seccion.getItems().add(item);
        seccionCartaRepository.save(seccion);

        return cartaRepository.findById(cartaId)
                .map(c -> ResponseEntity.ok(c))
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{cartaId}/secciones/{seccionId}/items/{itemId}")
    public ResponseEntity<Carta> eliminarItem(@PathVariable Long cartaId,
                                               @PathVariable Long seccionId,
                                               @PathVariable Long itemId) {
        Optional<SeccionCarta> seccionOpt = seccionCartaRepository.findById(seccionId);
        if (seccionOpt.isEmpty()) return ResponseEntity.notFound().build();

        SeccionCarta seccion = seccionOpt.get();
        seccion.getItems().removeIf(item -> item.getId().equals(itemId));
        for (int i = 0; i < seccion.getItems().size(); i++) {
            seccion.getItems().get(i).setOrden(i);
        }
        seccionCartaRepository.save(seccion);

        return cartaRepository.findById(cartaId)
                .map(c -> ResponseEntity.ok(c))
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{cartaId}/secciones/{seccionId}/items/{itemId}/orden")
    public ResponseEntity<Carta> moverItem(@PathVariable Long cartaId,
                                            @PathVariable Long seccionId,
                                            @PathVariable Long itemId,
                                            @RequestBody Map<String, String> body) {
        Optional<SeccionCarta> seccionOpt = seccionCartaRepository.findById(seccionId);
        if (seccionOpt.isEmpty()) return ResponseEntity.notFound().build();

        SeccionCarta seccion = seccionOpt.get();
        List<ItemSeccion> items = seccion.getItems();
        int idx = -1;
        for (int i = 0; i < items.size(); i++) {
            if (items.get(i).getId().equals(itemId)) { idx = i; break; }
        }
        if (idx == -1) return ResponseEntity.notFound().build();

        String direccion = body.get("direccion");
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

        return cartaRepository.findById(cartaId)
                .map(c -> ResponseEntity.ok(c))
                .orElse(ResponseEntity.notFound().build());
    }

    // ── ACTIVAR CARTA ──────────────────────────────────────────────────────────

    @PutMapping("/{id}/activar")
    public ResponseEntity<Carta> activarCarta(@PathVariable Long id) {
        return cartaRepository.findById(id).map(carta -> {
            cartaRepository.desactivarTodas();
            carta.setActiva(true);
            return ResponseEntity.ok(cartaRepository.save(carta));
        }).orElse(ResponseEntity.notFound().build());
    }
}

