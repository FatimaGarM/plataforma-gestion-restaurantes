package com.gestionqr.backend.controller;

import com.gestionqr.backend.model.Carta;
import com.gestionqr.backend.model.SeccionCarta;
import com.gestionqr.backend.service.CartaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/cartas")
public class CartaController {

    @Autowired
    private CartaService cartaService;

    // ── CARTAS ────────────────────────────────────────────────────────────────

    @GetMapping
    public List<Carta> listar() {
        return cartaService.listar();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Carta> obtener(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(cartaService.obtener(id));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public Carta crear(@RequestBody Map<String, String> body) {
        return cartaService.crear(body.get("nombre"));
    }

    @PutMapping("/{id}/nombre")
    public ResponseEntity<Carta> renombrar(@PathVariable Long id, @RequestBody Map<String, String> body) {
        try {
            return ResponseEntity.ok(cartaService.renombrar(id, body.get("nombre")));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/{id}/imagen")
    public ResponseEntity<Carta> subirImagen(@PathVariable Long id,
                                              @RequestParam("imagen") MultipartFile imagen) throws Exception {
        try {
            return ResponseEntity.ok(cartaService.subirImagen(id, imagen));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        try {
            cartaService.eliminar(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // ── SECCIONES ─────────────────────────────────────────────────────────────

    @PostMapping("/{cartaId}/secciones")
    public ResponseEntity<Carta> añadirSeccion(@PathVariable Long cartaId,
                                                @RequestBody Map<String, String> body) {
        try {
            return ResponseEntity.ok(cartaService.añadirSeccion(cartaId, body.get("nombre"), body.getOrDefault("nombreEn", "")));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{cartaId}/secciones/{seccionId}")
    public ResponseEntity<SeccionCarta> renombrarSeccion(@PathVariable Long cartaId,
                                                          @PathVariable Long seccionId,
                                                          @RequestBody Map<String, String> body) {
        try {
            return ResponseEntity.ok(cartaService.renombrarSeccion(cartaId, seccionId, body.get("nombre"), body.getOrDefault("nombreEn", "")));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{cartaId}/secciones/{seccionId}")
    public ResponseEntity<Carta> eliminarSeccion(@PathVariable Long cartaId,
                                                  @PathVariable Long seccionId) {
        try {
            return ResponseEntity.ok(cartaService.eliminarSeccion(cartaId, seccionId));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // ── ITEMS (platos en sección) ──────────────────────────────────────────────

    @PostMapping("/{cartaId}/secciones/{seccionId}/items")
    public ResponseEntity<Carta> añadirItem(@PathVariable Long cartaId,
                                             @PathVariable Long seccionId,
                                             @RequestBody Map<String, Long> body) {
        try {
            return ResponseEntity.ok(cartaService.añadirItem(cartaId, seccionId, body.get("platoId")));
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{cartaId}/secciones/{seccionId}/items/{itemId}")
    public ResponseEntity<Carta> eliminarItem(@PathVariable Long cartaId,
                                               @PathVariable Long seccionId,
                                               @PathVariable Long itemId) {
        try {
            return ResponseEntity.ok(cartaService.eliminarItem(cartaId, seccionId, itemId));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{cartaId}/secciones/{seccionId}/items/{itemId}/orden")
    public ResponseEntity<Carta> moverItem(@PathVariable Long cartaId,
                                            @PathVariable Long seccionId,
                                            @PathVariable Long itemId,
                                            @RequestBody Map<String, String> body) {
        try {
            return ResponseEntity.ok(cartaService.moverItem(cartaId, seccionId, itemId, body.get("direccion")));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // ── ACTIVAR CARTA ──────────────────────────────────────────────────────────

    @PutMapping("/{id}/activar")
    public ResponseEntity<Carta> activarCarta(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(cartaService.activar(id));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}