package com.gestionqr.backend.service;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.gestionqr.backend.model.Producto;
import com.gestionqr.backend.model.Proveedor;
import com.gestionqr.backend.repository.ProductoRepository;
import com.gestionqr.backend.repository.ProveedorRepository;

@Service
public class ProductoService {

    @Autowired
    private ProductoRepository productoRepository;

    @Autowired
    private ProveedorRepository proveedorRepository;

    public List<Producto> getAllProductos() {
        return productoRepository.findAll();
    }

    public Producto getProductoById(Long id) {
        return productoRepository.findById(id).orElseThrow(() -> new RuntimeException("Producto no encontrado"));
    }

    public Producto createProducto(Producto producto) {
        return productoRepository.save(producto);
    }

    public Producto updateProducto(Long id, Producto productoDetails) {

        Producto producto = productoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

        producto.setNombre(productoDetails.getNombre());
        producto.setPrecio(productoDetails.getPrecio());
        producto.setStock(productoDetails.getStock());
        producto.setDescripcion(productoDetails.getDescripcion());

        if (productoDetails.getProveedor() != null &&
                productoDetails.getProveedor().getId() != null) {

            Proveedor proveedor = proveedorRepository
                    .findById(productoDetails.getProveedor().getId())
                    .orElseThrow(() -> new RuntimeException("Proveedor no encontrado"));

            producto.setProveedor(proveedor);
        }

        return productoRepository.save(producto);
    }

    public void deleteProducto(Long id) {
        Producto producto = productoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));
        productoRepository.delete(producto);
    }

    public List<Producto> getProductosByProveedorId(Long proveedorId) {
        return productoRepository.findByProveedorId(proveedorId);
    }

    public void changeStock(Long productoId, Map<String, String> body) {
        Producto producto = productoRepository.findById(productoId)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));
        int nuevoStock = Integer.parseInt(body.get("nuevoStock"));
        producto.setStock(nuevoStock);
        productoRepository.save(producto);
    }
}
