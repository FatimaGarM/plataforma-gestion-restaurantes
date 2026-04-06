package com.gestionqr.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.gestionqr.backend.model.Servicio;
import com.gestionqr.backend.model.Servicio.EstadoServicio;

public interface ServicioRepository extends JpaRepository<Servicio, Long> {

    List<Servicio> findByEstado(EstadoServicio estado);

}