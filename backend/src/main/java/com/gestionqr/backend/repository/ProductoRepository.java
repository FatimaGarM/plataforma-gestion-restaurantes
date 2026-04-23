package com.gestionqr.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.gestionqr.backend.model.Producto;

public interface ProductoRepository  extends JpaRepository<Producto, Long> {

    List<Producto> findByProveedorId(Long proveedorId);
}
