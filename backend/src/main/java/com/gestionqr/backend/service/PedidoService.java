package com.gestionqr.backend.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.gestionqr.backend.model.Pedido;
import com.gestionqr.backend.model.Pedido.EstadoPedido;
import com.gestionqr.backend.model.Servicio;
import com.gestionqr.backend.model.Servicio.EstadoServicio;
import com.gestionqr.backend.repository.PedidoRepository;

@Service
public class PedidoService {
	
	@Autowired
	PedidoRepository pedidoRepository;
	
	public List<Pedido> obtenerPedidosPorEstado(EstadoPedido estado){
		return pedidoRepository.findByEstado(estado);
	}
	
    public Pedido crearPedido(@RequestBody Pedido pedido) {    	
    	return pedidoRepository.save(pedido);
    }
    
    private boolean esCambioValido(EstadoPedido actual, EstadoPedido nuevo) {
        return switch (actual) {
            case Pendiente -> nuevo == EstadoPedido.EnProceso;
            case EnProceso -> nuevo == EstadoPedido.Listo;
            case Listo -> nuevo == EstadoPedido.Servido;
            case Servido -> false;
        };
    }
    
    public Pedido cambiarEstado(Long id, EstadoPedido nuevoEstado) {

        Pedido pedido = pedidoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pedido no encontrado"));
        
        if (pedido.getServicio().getEstado() == EstadoServicio.Cerrado) {
            throw new RuntimeException("El servicio ya está cerrado");
        }

        EstadoPedido actual = pedido.getEstado();

        if (!esCambioValido(actual, nuevoEstado)) {
            throw new RuntimeException("Cambio de estado no permitido");
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
        }
    }
    
    public List<Pedido> obtenerActivos() {
        return pedidoRepository.findByEstadoIn(
            List.of(EstadoPedido.Pendiente, EstadoPedido.EnProceso)
        );
    }
}
