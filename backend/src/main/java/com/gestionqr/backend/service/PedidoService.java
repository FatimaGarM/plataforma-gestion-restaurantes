package com.gestionqr.backend.service;

import java.util.List;
<<<<<<< HEAD
=======
import java.util.Optional;
>>>>>>> origin/luis2

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.gestionqr.backend.model.Pedido;
import com.gestionqr.backend.model.Pedido.EstadoPedido;
import com.gestionqr.backend.model.Servicio;
import com.gestionqr.backend.model.Servicio.EstadoServicio;
import com.gestionqr.backend.repository.PedidoRepository;
import com.gestionqr.backend.repository.ServicioRepository;

@Service
public class PedidoService {

    @Autowired
    private PedidoRepository pedidoRepository;

    @Autowired
    private ServicioRepository servicioRepository;

    public List<Pedido> obtenerPedidosPorEstado(EstadoPedido estado) {
        return pedidoRepository.findByEstado(estado);
    }

    public Pedido crearPedido(Pedido pedido) {
        return pedidoRepository.save(pedido);
    }

<<<<<<< HEAD
    public Pedido cambiarEstado(Long id) {
=======
    public Pedido siguienteEstado(Long id) {
>>>>>>> origin/luis2

        Pedido pedido = pedidoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pedido no encontrado"));

        if (pedido.getServicio().getEstado() == EstadoServicio.Cerrado) {
            throw new RuntimeException("El servicio ya está cerrado");
        }

        EstadoPedido actual = pedido.getEstado();
        EstadoPedido nuevoEstado;

        switch (actual) {
            case Pendiente -> nuevoEstado = EstadoPedido.EnProceso;
            case EnProceso -> nuevoEstado = EstadoPedido.Listo;
            case Listo -> nuevoEstado = EstadoPedido.Servido;
            default -> throw new IllegalArgumentException("Unexpected value: " + actual);
        }

        pedido.setEstado(nuevoEstado);

        Pedido actualizado = pedidoRepository.save(pedido);

        Servicio servicio = pedido.getServicio();
        if (servicio != null) {
            comprobarYCerrarServicio(servicio);
        }

        return actualizado;
    }

    private void comprobarYCerrarServicio(Servicio servicio) {

        List<Pedido> pedidos = pedidoRepository.findByServicioId(servicio.getId());

        boolean todosServidos = pedidos.stream()
                .allMatch(p -> p.getEstado() == EstadoPedido.Servido);

        if (todosServidos) {
            servicio.setEstado(EstadoServicio.Cerrado);
            servicioRepository.save(servicio);
        }
    }

    public List<Pedido> obtenerActivos() {
        return pedidoRepository.findByEstadoIn(
                List.of(EstadoPedido.Pendiente, EstadoPedido.EnProceso, EstadoPedido.Listo)
        );
    }
}