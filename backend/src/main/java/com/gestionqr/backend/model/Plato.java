package com.gestionqr.backend.model;

import jakarta.persistence.*;

@Entity
public class Plato {

    // ENUM PARA EL TIPO DE PLATO (hemos usado enum para evitar errores de tipografía en los tipos)
    public enum TipoPlato {
        PRIMERO,
        SEGUNDO,
        TERCERO,
        POSTRE,
        BEBIDA
    }

    // ID
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Variables que definimos en figma y en la documentación
    private String nombre;
    private String descripcion;
    private Double precio;
    private String imagen;


    @Enumerated(EnumType.STRING)
    private TipoPlato tipo;

    private Boolean disponible = true; // por defecto disponible

    // CONSTRUCTOR VACÍO 
    public Plato() {}

    // GETTERS Y SETTERS

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

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public Double getPrecio() {
        return precio;
    }

    public void setPrecio(Double precio) {
        this.precio = precio;
    }

    public String getImagen() {
        return imagen;
    }

    public void setImagen(String imagen) {
        this.imagen = imagen;
    }

    public TipoPlato getTipo() {
        return tipo;
    }

    public void setTipo(TipoPlato tipo) {
        this.tipo = tipo;
    }

    public Boolean getDisponible() {
        return disponible;
    }

    public void setDisponible(Boolean disponible) {
        this.disponible = disponible;
    }

    // TO STRING 
    @Override
    public String toString() {
        return "Plato [id=" + id +
                ", nombre=" + nombre +
                ", descripcion=" + descripcion +
                ", precio=" + precio +
                ", tipo=" + tipo +
                ", disponible=" + disponible + "]";
    }
}