package com.gestionqr.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.gestionqr.backend.model.Pedido;
import com.gestionqr.backend.model.Pedido.EstadoPedido;

/**
 * Repositorio para acceder a los pedidos en la base de datos.
 */
public interface PedidoRepository extends JpaRepository<Pedido, Long> {

    /**
     * Obtener pedidos por un estado concreto.
     */
    List<Pedido> findByEstado(EstadoPedido estado);

    /**
     * Obtener pedidos por varios estados (útil para cocina).
     */
    List<Pedido> findByEstadoIn(List<EstadoPedido> estados);

    /**
     * Obtener pedidos de un servicio concreto (mesa).
     */
    List<Pedido> findByServicioId(Long servicioId);
}