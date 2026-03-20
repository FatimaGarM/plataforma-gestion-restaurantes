package com.gestionqr.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.gestionqr.backend.model.Servicio;
import com.gestionqr.backend.model.Servicio.EstadoServicio;


public interface ServicioRepository extends JpaRepository<Servicio, Long> {

	@Query(value = "SELECT * FROM pedidos WHERE estado = ?1", nativeQuery = true)
	List<Servicio> findServiciosFiltrados(EstadoServicio estado);
}
