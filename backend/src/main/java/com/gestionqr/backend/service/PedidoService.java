package com.gestionqr.backend.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.gestionqr.backend.model.Pedido;
import com.gestionqr.backend.model.Pedido.EstadoPedido;
import com.gestionqr.backend.model.Servicio;
import com.gestionqr.backend.model.Servicio.EstadoCobro;
import com.gestionqr.backend.model.Servicio.EstadoServicio;
import com.gestionqr.backend.model.repository.PedidoRepository;
import com.gestionqr.backend.model.repository.ServicioRepository;

@Service
public class PedidoService {

    @Autowired
    private PedidoRepository pedidoRepository;

    @Autowired
    private ServicioRepository servicioRepository;

    @Autowired
    private ServicioService servicioService;

    @Autowired
    private SesionMesaService sesionMesaService;

    public List<Pedido> obtenerPedidosPorEstado(EstadoPedido estado) {
        return pedidoRepository.findByEstado(estado);
    }

    public Pedido crearPedido(Pedido pedido) {
        return pedidoRepository.save(pedido);
    }

    @Transactional
    public Pedido siguienteEstado(Long id) {

        Pedido pedido = pedidoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pedido no encontrado"));

        if (pedido.getServicio() == null) {
            throw new RuntimeException("El pedido no tiene servicio asociado");
        }

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
            servicioService.marcarActividadMesa(servicio.getMesa());
            sesionMesaService.marcarActividadPorMesa(servicio.getMesa());
            comprobarYCerrarServicio(servicio);
        }

        return actualizado;
    }

    private void comprobarYCerrarServicio(Servicio servicio) {

        List<Pedido> pedidos = pedidoRepository.findByServicioId(servicio.getId());

        boolean todosServidos = pedidos.stream()
                .allMatch(p -> p.getEstado() == EstadoPedido.Servido);

        if (todosServidos && servicio.getEstadoCobro() == EstadoCobro.COBRADO_TOTAL) {
            servicio.setEstado(EstadoServicio.Cerrado);
            servicioRepository.save(servicio);
        }
    }

    public List<Pedido> obtenerActivos() {
        return pedidoRepository.findByEstadoInAndServicio_EstadoNot(
                List.of(EstadoPedido.Pendiente, EstadoPedido.EnProceso, EstadoPedido.Listo),
                Servicio.EstadoServicio.Cerrado
        );
    }
}
