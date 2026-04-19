package com.gestionqr.backend.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.gestionqr.backend.model.Menu;
import com.gestionqr.backend.model.Menu.DiaMenu;
import com.gestionqr.backend.service.MenuService;

/**
 * Controlador REST para la gestión de menus.
 * Se encarga de recibir las peticiones HTTP y delegar la lógica al servicio.
 */
@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/menus")
public class MenuController {

    @Autowired
    private MenuService menuService;

    @GetMapping
    public List<Menu> listar() {
        return menuService.obtenerTodosMenus();
    }

    @GetMapping("/{id}")
    public Menu obtenerPorId(@PathVariable Long id) {
        return menuService.obtenerMenuPorId(id);
    }

    @PostMapping
    public Menu crear(@RequestBody Map<String, String> body) {
        System.out.println("ENTRA EN BACKEND");
        try {
            String diaStr = body.get("dia");
            String precioStr = body.get("precio");

            if (diaStr == null || precioStr == null) {
                throw new RuntimeException("Datos incompletos");
            }

            Menu.DiaMenu dia = Menu.DiaMenu.valueOf(diaStr.trim());
            Double precio = Double.valueOf(precioStr);

            return menuService.crearMenu(dia, precio);

        } catch (Exception e) {
            throw new RuntimeException("Error al crear menú: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public Menu actualizar(@PathVariable Long id, @RequestBody Map<String, String> body) {
        try {
            String diaStr = body.get("dia");
            String precioStr = body.get("precio");

            if (diaStr == null || precioStr == null) {
                throw new RuntimeException("Datos incompletos");
            }

            Menu.DiaMenu dia = Menu.DiaMenu.valueOf(diaStr);
            Double precio = Double.valueOf(precioStr);

            return menuService.actualizarMenu(id, dia, precio);

        } catch (Exception e) {
            throw new RuntimeException("Error al actualizar menú: " + e.getMessage());
        }
    }

    @DeleteMapping("/{menuId}")
    public void eliminar(@PathVariable Long menuId) {
        menuService.eliminarMenu(menuId);
    }

    @PutMapping("/{menuId}/plato/{platoId}")
    public Menu agregarPlato(@PathVariable Long menuId, @PathVariable Long platoId) {
        return menuService.agregarPlato(menuId, platoId);
    }

    @DeleteMapping("/{menuId}/plato/{menuPlatoId}")
    public Menu eliminarPlato(@PathVariable Long menuId, @PathVariable Long menuPlatoId) {
        return menuService.eliminarPlato(menuId, menuPlatoId);
    }

    @PutMapping("/{menuId}/plato/{menuPlatoId}/mover")
    public ResponseEntity<Menu> moverPlato(@PathVariable Long menuId,@PathVariable Long menuPlatoId,@RequestBody Map<String, String> body) {
        return menuService.moverPlato(menuId, menuPlatoId, body);
    }

}
