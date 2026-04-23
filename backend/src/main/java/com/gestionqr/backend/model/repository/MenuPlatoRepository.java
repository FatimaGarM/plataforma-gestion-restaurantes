package com.gestionqr.backend.model.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.gestionqr.backend.model.MenuPlato;

/**
 * Repositorio para acceder a los pedidos en la base de datos.
 */
public interface MenuPlatoRepository extends JpaRepository<MenuPlato, Long> {
    List<MenuPlato> findByMenuId(Long menuId);
}