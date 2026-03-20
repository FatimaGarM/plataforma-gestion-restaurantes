package com.gestionqr.backend.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.gestionqr.backend.model.Empleado.Estado;
import com.gestionqr.backend.model.Pedido;
import com.gestionqr.backend.model.Pedido.EstadoPedido;
import com.gestionqr.backend.model.Servicio;
import com.gestionqr.backend.model.Servicio.EstadoServicio;
import com.gestionqr.backend.repository.PedidoRepository;
import com.gestionqr.backend.repository.ServicioRepository;

@Service
public class PedidoService {

	@Autowired
	PedidoRepository pedidoRepository;
	
	@Autowired
	ServicioRepository servicioRepository;

	public List<Pedido> obtenerPedidosPorEstado(EstadoPedido estado) {
		return pedidoRepository.findByEstado(estado);
	}

	public Pedido crearPedido(@RequestBody Pedido pedido) {
		return pedidoRepository.save(pedido);
	}

	public Pedido cambiarEstado(Long id) {

		Pedido pedido = pedidoRepository.findById(id).orElseThrow(() -> new RuntimeException("Pedido no encontrado"));

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

		boolean todosServidos = pedidos.stream().allMatch(p -> p.getEstado() == EstadoPedido.Servido);

		if (todosServidos) {
			servicio.setEstado(EstadoServicio.Cerrado);
			servicioRepository.save(servicio);
		}
		
	}

	public List<Pedido> obtenerActivos() {
		return pedidoRepository
				.findByEstadoIn(List.of(EstadoPedido.Pendiente, EstadoPedido.EnProceso, EstadoPedido.Listo));
	}
}
