package com.gestionqr.backend.model.repository;

import com.gestionqr.backend.model.LlamadaCamarero;
import com.gestionqr.backend.model.LlamadaCamarero.EstadoLlamada;
import com.gestionqr.backend.model.LlamadaCamarero.TipoLlamada;
import com.gestionqr.backend.model.Servicio;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface LlamadaCamareraRepository extends JpaRepository<LlamadaCamarero, Long> {

    Optional<LlamadaCamarero> findFirstByServicioAndTipoAndEstado(
            Servicio servicio, TipoLlamada tipo, EstadoLlamada estado);

    List<LlamadaCamarero> findByEstadoIn(List<EstadoLlamada> estados);

    List<LlamadaCamarero> findByServicio(Servicio servicio);
}
