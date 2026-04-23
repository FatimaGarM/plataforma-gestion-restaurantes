package com.gestionqr.backend.model.repository;

import com.gestionqr.backend.model.SesionMesa;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SesionMesaRepository extends JpaRepository<SesionMesa, Long> {
    Optional<SesionMesa> findByTokenAndActivaTrue(String token);
    Optional<SesionMesa> findByMesaAndActivaTrue(int mesa);
    Optional<SesionMesa> findFirstByMesaAndActivaTrueOrderByCreadoEnDesc(int mesa);
    List<SesionMesa> findAllByMesaAndActivaTrue(int mesa);
    List<SesionMesa> findAllByActivaTrue();
}

