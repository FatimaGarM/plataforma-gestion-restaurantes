package com.gestionqr.backend.model;

import jakarta.persistence.*;
import java.time.LocalDate;

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
    private String nombreEn;
    private String descripcion;
    private String descripcionEn;
    private Double precio;
    private String imagen;


    @Enumerated(EnumType.STRING)
    private TipoPlato tipo;

    private Boolean disponible = true; // por defecto disponible

    private Boolean esNovedad = false; // plato marcado como novedad para estadísticas

    private LocalDate fechaCreacion;

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

    public String getNombreEn() {
        return nombreEn;
    }

    public void setNombreEn(String nombreEn) {
        this.nombreEn = nombreEn;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public String getDescripcionEn() {
        return descripcionEn;
    }

    public void setDescripcionEn(String descripcionEn) {
        this.descripcionEn = descripcionEn;
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

    public Boolean getEsNovedad() {
        return esNovedad;
    }

    public void setEsNovedad(Boolean esNovedad) {
        this.esNovedad = esNovedad;
    }

    public LocalDate getFechaCreacion() {
        return fechaCreacion;
    }

    public void setFechaCreacion(LocalDate fechaCreacion) {
        this.fechaCreacion = fechaCreacion;
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