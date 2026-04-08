package com.gestionqr.backend.repository;

import com.gestionqr.backend.model.Carta;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CartaRepository extends JpaRepository<Carta, Long> {}
