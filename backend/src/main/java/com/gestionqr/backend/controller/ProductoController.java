package com.gestionqr.backend.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.gestionqr.backend.model.Producto;
import com.gestionqr.backend.service.ProductoService;

@CrossOrigin(origins = "http://localhost:5173") // Permitir solicitudes desde el frontend en localhost:5173
@RequestMapping("/productos")
@RestController
public class ProductoController {

    @Autowired
    private ProductoService productoService;

    @GetMapping
    public  List<Producto> getAllProductos() {
        return productoService.getAllProductos();
    }

    @GetMapping("/{id}")
    public Producto getProductoById(@PathVariable Long id) {
        return productoService.getProductoById(id);
    }

    @PostMapping
    public Producto createProducto(@RequestBody Producto producto) {
        return productoService.createProducto(producto);
    }

    @PutMapping("/{id}")
    public Producto updateProducto(@PathVariable Long id, @RequestBody Producto productoDetails) {
        return productoService.updateProducto(id, productoDetails);
    }

    @DeleteMapping("/{id}")
    public void deleteProducto(@PathVariable Long id) {
        productoService.deleteProducto(id);
    }

    @GetMapping("/proveedor/{proveedorId}")
    public List<Producto> getProductosByProveedorId(@PathVariable Long proveedorId) {
        return productoService.getProductosByProveedorId(proveedorId);
    }

    @PutMapping("/{id}/cambiar-stock")
    public void changeStock(@PathVariable Long id, @RequestBody Map<String, String> body) {
        productoService.changeStock(id, body);
    }
}
