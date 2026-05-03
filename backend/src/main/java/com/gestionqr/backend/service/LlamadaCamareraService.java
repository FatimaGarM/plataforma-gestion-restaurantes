package com.gestionqr.backend.service;

import com.gestionqr.backend.model.LlamadaCamarero;
import com.gestionqr.backend.model.LlamadaCamarero.EstadoLlamada;
import com.gestionqr.backend.model.LlamadaCamarero.TipoLlamada;
import com.gestionqr.backend.model.Servicio;
import com.gestionqr.backend.model.SesionMesa;
import com.gestionqr.backend.model.repository.LlamadaCamareraRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class LlamadaCamareraService {

    private static final int MINUTOS_TIMEOUT = 15;

    @Autowired
    private LlamadaCamareraRepository llamadaRepository;

    @Transactional
    public LlamadaCamarero solicitar(Servicio servicio, SesionMesa sesion,
                                      TipoLlamada tipo, String metodoPago) {
        Optional<LlamadaCamarero> activa = llamadaRepository
                .findFirstByServicioAndTipoAndEstado(servicio, tipo, EstadoLlamada.PENDIENTE);

        if (activa.isPresent()) {
            LlamadaCamarero llamada = activa.get();
            boolean expirada = llamada.getFechaCreacion()
                    .isBefore(LocalDateTime.now().minusMinutes(MINUTOS_TIMEOUT));

            if (!expirada) {
                return llamada;
            }
            // Expirada: cancelar la anterior y crear nueva
            llamada.setEstado(EstadoLlamada.CANCELADA);
            llamadaRepository.save(llamada);
        }

        LlamadaCamarero nueva = new LlamadaCamarero();
        nueva.setServicio(servicio);
        nueva.setSesionMesa(sesion);
        nueva.setTipo(tipo);
        nueva.setEstado(EstadoLlamada.PENDIENTE);
        nueva.setMetodoPago(metodoPago);
        return llamadaRepository.save(nueva);
    }

    @Transactional
    public LlamadaCamarero atender(Long id) {
        LlamadaCamarero llamada = llamadaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Llamada no encontrada"));

        if (llamada.getEstado() != EstadoLlamada.PENDIENTE) {
            throw new RuntimeException("La llamada ya fue atendida o cancelada");
        }

        llamada.setEstado(EstadoLlamada.ATENDIDA);
        llamada.setFechaAtencion(LocalDateTime.now());
        return llamadaRepository.save(llamada);
    }

    public List<Map<String, Object>> obtenerPendientes() {
        return llamadaRepository.findByEstadoIn(List.of(EstadoLlamada.PENDIENTE))
                .stream()
                .map(l -> {
                    Map<String, Object> m = new LinkedHashMap<>();
                    m.put("id", l.getId());
                    m.put("mesa", l.getServicio().getMesa());
                    m.put("servicioId", l.getServicio().getId());
                    m.put("tipo", l.getTipo());
                    m.put("estado", l.getEstado());
                    m.put("metodoPago", l.getMetodoPago());
                    m.put("fechaCreacion", l.getFechaCreacion());
                    return m;
                })
                .toList();
    }
}
