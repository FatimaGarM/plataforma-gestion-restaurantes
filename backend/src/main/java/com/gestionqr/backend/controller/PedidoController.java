package com.gestionqr.backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.gestionqr.backend.model.Pedido;
import com.gestionqr.backend.model.Pedido.EstadoPedido;
import com.gestionqr.backend.service.PedidoService;

/**
 * Controlador REST para la gestión de pedidos.
 */
@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/pedidos")
public class PedidoController {

    @Autowired
    private PedidoService pedidoService;

    /**
     * Obtener pedidos por estado en cocina cocina.
     */
    @GetMapping("/{estado}")
    public List<Pedido> obtenerPedidosPorEstado(@PathVariable EstadoPedido estado) {
        return pedidoService.obtenerPedidosPorEstado(estado);
    }

    /**
     * Crear pedido manual (opcional).
     */
    @PostMapping
    public Pedido crearPedido(@RequestBody Pedido pedido) {
        return pedidoService.crearPedido(pedido);
    }

    /**
     * Cambiar estado del pedido al siguiente.
     */
    @PutMapping("/{id}/siguiente-estado")
    public Pedido cambiarEstado(
            @PathVariable Long id) {

        return pedidoService.cambiarEstado(id);
    }

    /**
     * Obtener pedidos activos en la pantalla cocina
     */
    @GetMapping("/activos")
    public List<Pedido> obtenerActivos() {
        return pedidoService.obtenerActivos();
    }
}