package com.gestionqr.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.gestionqr.backend.model.Menu;
import com.gestionqr.backend.model.Pedido;
import com.gestionqr.backend.model.Pedido.EstadoPedido;

/**
 * Repositorio para acceder a los pedidos en la base de datos.
 */
public interface MenuRepository extends JpaRepository<Menu, Long> {
    Optional<Menu> findByDia(Menu.DiaMenu dia);
}