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
    
    @PutMapping("/{id}/estado")
    public Pedido cambiarEstado(
            @PathVariable Long id,
            @RequestParam EstadoPedido estado) {

        return pedidoService.cambiarEstado(id, estado);
    }
    
    public List<Pedido> obtenerActivos() {
        return pedidoService.obtenerActivos();
    }

}
