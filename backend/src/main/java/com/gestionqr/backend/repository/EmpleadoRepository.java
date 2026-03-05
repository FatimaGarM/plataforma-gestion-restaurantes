package com.gestionqr.backend.repository;

import com.gestionqr.backend.model.Empleado;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EmpleadoRepository extends JpaRepository<Empleado, Long> {

}