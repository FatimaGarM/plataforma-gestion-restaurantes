package com.gestionqr.backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.gestionqr.backend.model.Pedido;
import com.gestionqr.backend.model.Pedido.EstadoPedido;
import com.gestionqr.backend.service.PedidoService;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/pedidos")
public class PedidoController {
	
	@Autowired
	PedidoService pedidoService;
	
	@GetMapping("{estado}")
    public List<Pedido> obtenerPedidosPorEstado(@PathVariable EstadoPedido estado) {
        return pedidoService.obtenerPedidosPorEstado(estado);
    }
	
    public Pedido crearPedido(Pedido pedido) {    	
    	return pedidoService.crearPedido(pedido);
    }
    
    @PutMapping("/{id}/avanzar-estado")
    public Pedido cambiarEstado(
            @PathVariable Long id) {

        return pedidoService.avanzarEstado(id);
    }
    
    @PutMapping("/{id}/retroceder-estado")
    public Pedido retrocederrEstado(
            @PathVariable Long id) {

        return pedidoService.retrocederEstado(id);
    }
    
    @GetMapping("/activos")
    public List<Pedido> obtenerActivos() {
        return pedidoService.obtenerActivos();
    }

}
