package com.gestionqr.backend.service;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.gestionqr.backend.model.Menu;
import com.gestionqr.backend.model.Menu.DiaMenu;
import com.gestionqr.backend.model.MenuPlato;
import com.gestionqr.backend.model.Plato;
import com.gestionqr.backend.model.repository.MenuRepository;
import com.gestionqr.backend.model.repository.PlatoRepository;

@Service
public class MenuService {

    private final ArchivoService archivoService;

    @Autowired
    private PlatoRepository platoRepository;

    @Autowired
    private MenuRepository menuRepository;

    public MenuService(ArchivoService archivoService) {
        this.archivoService = archivoService;
    }

    public List<Menu> obtenerTodosMenus() {
        return menuRepository.findAll();
    }

    public Menu obtenerMenuPorId(Long id) {
        return menuRepository.findById(id).orElseThrow(() -> new RuntimeException("Menu no encontrado"));
    }

    public Menu crearMenu(DiaMenu dia, Double precio) {

        List<Menu> menus = menuRepository.findByDia(dia);

        if (!menus.isEmpty()) {
            menuRepository.deleteById(menus.get(0).getId());
        }

        Menu menu = new Menu();
        menu.setPrecio(precio);
        menu.setDia(dia);

        return menuRepository.save(menu);
    }

    public Menu actualizarMenu(Long id, DiaMenu dia, Double precio) {
        Menu menu = menuRepository.findById(id).orElseThrow(() -> new RuntimeException("Menu no encontrado"));

        menu.setPrecio(precio);
        menu.setDia(dia);

        return menuRepository.save(menu);
    }

    public void eliminarMenu(Long id) {
        menuRepository.deleteById(id);
    }

    public Menu agregarPlato(Long menuId, Long platoId) {
        Menu menu = menuRepository.findById(menuId).orElseThrow(() -> new RuntimeException("Menu no encontrado"));
        Plato plato = platoRepository.findById(platoId).orElseThrow(() -> new RuntimeException("Plato no encontrado"));

        MenuPlato menuPlato = new MenuPlato();
        menuPlato.setMenu(menu);
        menuPlato.setPlato(plato);
        menuPlato.setTipoPlato(plato.getTipo());
        int orden = (int) (menu.getItems().stream()
                .filter(m -> m.getTipoPlato() != null && m.getTipoPlato().equals(menuPlato.getTipoPlato())).count());
        menuPlato.setOrden(orden); // Asigna el orden basado en la cantidad actual de platos

        menu.getItems().add(menuPlato);
        return menuRepository.save(menu);
    }

    public Menu eliminarPlato(Long menuId, Long menuPlatoId) {
        Menu menu = menuRepository.findById(menuId)
                .orElseThrow(() -> new RuntimeException("Menu no encontrado"));

        menu.getItems().removeIf(mp -> mp.getId().equals(menuPlatoId));

        for (int i = 0; i < menu.getItems().size(); i++) {
            menu.getItems().get(i).setOrden(i);
        }

        return menuRepository.save(menu);
    }

    public ResponseEntity<Menu> moverPlato(Long menuId, Long menuPlatoId, Map<String, String> body) {

        Menu menu = menuRepository.findById(menuId)
                .orElseThrow(() -> new RuntimeException("Menu no encontrado"));

        MenuPlato actual = menu.getItems().stream()
                .filter(mp -> mp.getId().equals(menuPlatoId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Item no encontrado"));

        // Filtrar por misma categoría
        List<MenuPlato> items = menu.getItems().stream()
                .filter(mp -> mp.getTipoPlato().equals(actual.getTipoPlato()))
                .sorted((a, b) -> Integer.compare(a.getOrden(), b.getOrden()))
                .toList();

        int idx = -1;
        for (int i = 0; i < items.size(); i++) {
            if (items.get(i).getId().equals(menuPlatoId)) {
                idx = i;
                break;
            }
        }

        if (idx == -1)
            return ResponseEntity.notFound().build();

        String direccion = body.get("direccion");

        if ("subir".equals(direccion) && idx > 0) {
            MenuPlato a = items.get(idx);
            MenuPlato b = items.get(idx - 1);

            int temp = a.getOrden();
            a.setOrden(b.getOrden());
            b.setOrden(temp);

        } else if ("bajar".equals(direccion) && idx < items.size() - 1) {
            MenuPlato a = items.get(idx);
            MenuPlato b = items.get(idx + 1);

            int temp = a.getOrden();
            a.setOrden(b.getOrden());
            b.setOrden(temp);

        } else {
            return ResponseEntity.badRequest().build();
        }

        menuRepository.save(menu);

        return ResponseEntity.ok(menu);
    }
}