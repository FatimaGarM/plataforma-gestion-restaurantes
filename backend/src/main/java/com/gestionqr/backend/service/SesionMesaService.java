package com.gestionqr.backend.service;

import com.gestionqr.backend.model.SesionMesa;
import com.gestionqr.backend.model.repository.SesionMesaRepository;
import jakarta.transaction.Transactional;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.security.SecureRandom;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class SesionMesaService {

    public record ResultadoSesion(
            SesionMesa sesion,
            boolean codigoRequerido,
            boolean codigoInvalido,
            boolean esNueva,
            String modo
    ) {}

    private static final String ALFABETO_SEGURO = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    private static final int LONGITUD_CODIGO = 8;
    private static final long MINUTOS_INACTIVIDAD_CIERRE = 120;

    private final SesionMesaRepository repo;
    private final SecureRandom secureRandom = new SecureRandom();

    public SesionMesaService(SesionMesaRepository repo) {
        this.repo = repo;
    }

    public ResultadoSesion solicitarSesion(int mesa, String codigo) {
        cerrarMesaSiInactiva(mesa);
        Optional<SesionMesa> activaOpt = repo.findFirstByMesaAndActivaTrueOrderByCreadoEnDesc(mesa);

        if (activaOpt.isEmpty()) {
            SesionMesa s = new SesionMesa();
            s.setMesa(mesa);
            s.setToken(UUID.randomUUID().toString());
            s.setCodigoAcceso(generarCodigoAccesoSeguro());
            s.setUltimaActividad(LocalDateTime.now());
            return new ResultadoSesion(repo.save(s), false, false, true, s.getModo());
        }

        SesionMesa activa = activaOpt.get();

        if ("PENDIENTE".equals(activa.getModo())) {
            tocarActividad(activa);
            return new ResultadoSesion(activa, false, false, false, activa.getModo());
        }

        if ("INDIVIDUAL".equals(activa.getModo())) {
            return new ResultadoSesion(null, true, false, false, activa.getModo());
        }

        if (activa.getCodigoAcceso() == null || activa.getCodigoAcceso().isBlank()) {
            activa.setCodigoAcceso(generarCodigoAccesoSeguro());
            activa = repo.save(activa);
        }

        if (codigo == null || codigo.isBlank()) {
            return new ResultadoSesion(null, true, false, false, activa.getModo());
        }

        if (!activa.getCodigoAcceso().equalsIgnoreCase(codigo.trim())) {
            return new ResultadoSesion(null, true, true, false, activa.getModo());
        }

        tocarActividad(activa);
        return new ResultadoSesion(activa, false, false, false, activa.getModo());
    }

    public Optional<SesionMesa> validarToken(String token) {
        Optional<SesionMesa> sesionOpt = repo.findByTokenAndActivaTrue(token);
        if (sesionOpt.isPresent() && estaInactiva(sesionOpt.get())) {
            SesionMesa sesion = sesionOpt.get();
            sesion.setActiva(false);
            repo.save(sesion);
            return Optional.empty();
        }
        return sesionOpt;
    }

    @Transactional
    public SesionMesa establecerModo(String token, String modo) {
        SesionMesa sesion = repo.findByTokenAndActivaTrue(token)
                .orElseThrow(() -> new IllegalArgumentException("SESION_INVALIDA"));

        if (!"PENDIENTE".equals(sesion.getModo())) {
            throw new IllegalStateException("MODO_YA_ESTABLECIDO");
        }

        if (!"INDIVIDUAL".equals(modo) && !"GRUPO".equals(modo)) {
            throw new IllegalArgumentException("MODO_INVALIDO");
        }

        sesion.setModo(modo);
        sesion.setUltimaActividad(LocalDateTime.now());
        return repo.save(sesion);
    }

    @Transactional
    public int asignarNuevaPersona(String token) {
        SesionMesa sesion = repo.findByTokenAndActivaTrue(token)
                .orElseThrow(() -> new IllegalArgumentException("SESION_INVALIDA"));

        int nuevaPersona = sesion.getContadorPersonas() + 1;
        sesion.setContadorPersonas(nuevaPersona);
        sesion.setUltimaActividad(LocalDateTime.now());
        repo.save(sesion);
        return nuevaPersona;
    }

    @Transactional
    public Optional<SesionMesa> validarTokenYRenovarActividad(String token) {
        Optional<SesionMesa> sesionOpt = repo.findByTokenAndActivaTrue(token);
        sesionOpt.ifPresent(this::tocarActividad);
        return sesionOpt;
    }

    @Transactional
    public void marcarActividadPorMesa(int mesa) {
        repo.findAllByMesaAndActivaTrue(mesa).forEach(this::tocarActividad);
    }

    public void cerrarMesa(int mesa) {
        repo.findAllByMesaAndActivaTrue(mesa).forEach(s -> {
            s.setActiva(false);
            repo.save(s);
        });
    }

    @Transactional
    public void cerrarMesaSiInactiva(int mesa) {
        repo.findAllByMesaAndActivaTrue(mesa).forEach(sesion -> {
            if (estaInactiva(sesion)) {
                sesion.setActiva(false);
                repo.save(sesion);
            }
        });
    }

    public List<Integer> obtenerMesasConSesionActiva() {
        return repo.findAllByActivaTrue().stream()
                .map(SesionMesa::getMesa)
                .distinct()
                .sorted(Comparator.naturalOrder())
                .toList();
    }

    private String generarCodigoAccesoSeguro() {
        StringBuilder sb = new StringBuilder(LONGITUD_CODIGO);
        for (int i = 0; i < LONGITUD_CODIGO; i++) {
            int idx = secureRandom.nextInt(ALFABETO_SEGURO.length());
            sb.append(ALFABETO_SEGURO.charAt(idx));
        }
        return sb.toString();
    }

    // Cada día a las 4:00 AM cierra las sesiones activas de días anteriores
    @Scheduled(cron = "0 0 4 * * *")
    @Transactional
    public void cerrarSesionesAnteriores() {
        LocalDateTime inicioDiaActual = LocalDateTime.now().toLocalDate().atStartOfDay();
        repo.findAllByActivaTrue().stream()
                .filter(s -> s.getCreadoEn() != null && s.getCreadoEn().isBefore(inicioDiaActual))
                .forEach(s -> {
                    s.setActiva(false);
                    repo.save(s);
                });
    }

    private boolean estaInactiva(SesionMesa sesion) {
        LocalDateTime referencia = sesion.getUltimaActividad() != null ? sesion.getUltimaActividad() : sesion.getCreadoEn();
        return referencia != null && referencia.plusMinutes(MINUTOS_INACTIVIDAD_CIERRE).isBefore(LocalDateTime.now());
    }

    private void tocarActividad(SesionMesa sesion) {
        sesion.setUltimaActividad(LocalDateTime.now());
        repo.save(sesion);
    }
}
