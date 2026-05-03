package com.gestionqr.backend.model.repository;

import com.gestionqr.backend.model.Carta;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

public interface CartaRepository extends JpaRepository<Carta, Long> {

    java.util.Optional<Carta> findByActivaTrue();

    @Modifying
    @Transactional
    @Query("UPDATE Carta c SET c.activa = false")
    void desactivarTodas();
}
