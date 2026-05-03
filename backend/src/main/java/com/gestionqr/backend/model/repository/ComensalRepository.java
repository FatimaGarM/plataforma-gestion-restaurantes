package com.gestionqr.backend.model.repository;

import com.gestionqr.backend.model.Comensal;
import com.gestionqr.backend.model.SesionMesa;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ComensalRepository extends JpaRepository<Comensal, Long> {

    List<Comensal> findBySesionMesa(SesionMesa sesionMesa);

    Optional<Comensal> findFirstBySesionMesa(SesionMesa sesionMesa);

    Optional<Comensal> findBySesionMesaAndNumero(SesionMesa sesionMesa, Integer numero);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT c FROM Comensal c WHERE c.id = :id")
    Optional<Comensal> findByIdWithLock(@Param("id") Long id);

    int countBySesionMesa(SesionMesa sesionMesa);
}
