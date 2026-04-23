package com.gestionqr.backend.model;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OrderBy;

@Entity
public class Proveedor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombre;

    private String email;

    private String telefono;

    public Proveedor() {
    }

    @OneToMany(mappedBy = "proveedor", cascade = { CascadeType.PERSIST,
            CascadeType.MERGE }, orphanRemoval = true, fetch = FetchType.LAZY)
    @OrderBy("nombre ASC")
    @JsonManagedReference
    private List<Producto> productos = new ArrayList<>();

    public Proveedor(String nombre, String email, String telefono) {
        this.nombre = nombre;
        this.email = email;
        this.telefono = telefono;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getTelefono() {
        return telefono;
    }

    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }

    public void addProducto(Producto producto) {
        producto.setProveedor(this);
        this.productos.add(producto);
    }

    public void removeProducto(Producto producto) {
        producto.setProveedor(null);
        this.productos.remove(producto);
    }

    public String toString() {
        return "Proveedor [id=" + id + ", nombre=" + nombre + ", email=" + email + ", telefono=" + telefono + "]";
    }
}
