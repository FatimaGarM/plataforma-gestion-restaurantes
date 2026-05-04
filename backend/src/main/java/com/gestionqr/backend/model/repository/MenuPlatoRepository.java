package com.gestionqr.backend.model.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.gestionqr.backend.model.MenuPlato;

public interface MenuPlatoRepository extends JpaRepository<MenuPlato, Long> {
    List<MenuPlato> findByMenuId(Long menuId);
}