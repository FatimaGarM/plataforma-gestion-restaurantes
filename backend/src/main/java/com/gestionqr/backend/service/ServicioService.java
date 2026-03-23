package com.gestionqr.backend.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.gestionqr.backend.model.Pedido;
import com.gestionqr.backend.model.Pedido.EstadoPedido;
import com.gestionqr.backend.model.Servicio;
import com.gestionqr.backend.model.Servicio.EstadoServicio;
import com.gestionqr.backend.repository.PlatoRepository;
import com.gestionqr.backend.repository.ServicioRepository;

@Service
public class ServicioService {

    @Autowired
    private ServicioRepository servicioRepository;

    @Autowired
    private PlatoRepository platoRepository;

    public List<Servicio> obtenerServiciosPorEstado(EstadoServicio estado) {
        return servicioRepository.findByEstado(estado);
    }

    public Servicio crearServicio(List<Long> platosIds, int mesa) {

        Servicio servicio = new Servicio();
        servicio.setEstado(EstadoServicio.Abierto);
        servicio.setMesa(mesa);

        List<Pedido> pedidos = new ArrayList<>();

        for (Long platoId : platosIds) {
            Pedido pedido = new Pedido();
            pedido.setMesa(mesa);
            pedido.setPlato(platoRepository.findById(platoId).orElseThrow(() -> new RuntimeException("Plato no encontrado")));
            pedido.setEstado(EstadoPedido.Pendiente);
            pedido.setServicio(servicio);
            pedidos.add(pedido);
        }

        servicio.setPedidos(pedidos);

        return servicioRepository.save(servicio);
    }
}