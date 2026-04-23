package com.gestionqr.backend.model.repository;

import com.gestionqr.backend.model.Carta;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CartaRepository extends JpaRepository<Carta, Long> {
    java.util.Optional<Carta> findByActivaTrue();
}

