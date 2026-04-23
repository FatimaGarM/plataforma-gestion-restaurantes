package com.gestionqr.backend.model.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.gestionqr.backend.model.Servicio;
import com.gestionqr.backend.model.Servicio.EstadoCobro;
import com.gestionqr.backend.model.Servicio.EstadoServicio;

public interface ServicioRepository extends JpaRepository<Servicio, Long> {

    List<Servicio> findByEstado(EstadoServicio estado);
    List<Servicio> findByMesaAndEstado(int mesa, EstadoServicio estado);

    java.util.Optional<Servicio> findFirstByMesaAndEstado(int mesa, EstadoServicio estado);

    List<Servicio> findByEstadoCobroIn(List<EstadoCobro> estados);

}

