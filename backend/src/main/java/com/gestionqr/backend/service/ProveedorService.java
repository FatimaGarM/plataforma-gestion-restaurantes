package com.gestionqr.backend.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.gestionqr.backend.model.Producto;
import com.gestionqr.backend.model.Proveedor;
import com.gestionqr.backend.repository.ProductoRepository;
import com.gestionqr.backend.repository.ProveedorRepository;

@Service
public class ProveedorService {

    @Autowired
    private ProveedorRepository proveedorRepository;

    @Autowired
    private ProductoRepository productosRepository;

    public List<Proveedor> getAllProveedores() {
        return proveedorRepository.findAll();
    }

    public Proveedor getProveedorById(Long id) {
        return proveedorRepository.findById(id).orElseThrow(() -> new RuntimeException("Proveedor no encontrado"));
    }

    public Proveedor createProveedor(Proveedor proveedor) {
        return proveedorRepository.save(proveedor);
    }

    public Proveedor updateProveedor(Long id, Proveedor proveedorDetails) {
        Proveedor proveedor = proveedorRepository.findById(id).orElseThrow(() -> new RuntimeException("Proveedor no encontrado"));

        proveedor.setNombre(proveedorDetails.getNombre());
        proveedor.setEmail(proveedorDetails.getEmail());
        proveedor.setTelefono(proveedorDetails.getTelefono());

        return proveedorRepository.save(proveedor);
    }

    public void deleteProveedor(Long id) {
        Proveedor proveedor = proveedorRepository.findById(id).orElseThrow(() -> new RuntimeException("Proveedor no encontrado"));
        List<Producto> productos = productosRepository.findByProveedorId(proveedor.getId());
        for (Producto producto : productos) {
            producto.setProveedor(null);
            productosRepository.save(producto);
        }
        proveedorRepository.delete(proveedor);
    }
}
