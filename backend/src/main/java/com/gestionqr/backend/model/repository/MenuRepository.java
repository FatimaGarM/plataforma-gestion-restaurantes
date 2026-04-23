package com.gestionqr.backend.model.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.gestionqr.backend.model.Menu;

public interface MenuRepository extends JpaRepository<Menu, Long> {
    List<Menu> findByDia(Menu.DiaMenu dia);
}