package com.gestionqr.backend.model;

import jakarta.persistence.*;

@Entity
public class Empleado {

    public enum TipoEmpleado {
        CAMARERO, COCINERO, GERENTE
    }

    public enum Estado {
        DESCANSO, VACACIONES, ACTIVO
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombre;

    @Column(unique = true)
    private String email;

    private String contraseña;

    private String imagen;

    @Enumerated(EnumType.STRING)
    private TipoEmpleado tipoEmpleado;

    @Enumerated(EnumType.STRING)
    private Estado estado;

    public Empleado() {
    }

    public Empleado(Long id, String nombre, String email, String contraseña, String imagen,
            TipoEmpleado tipoEmpleado, Estado estado) {
        this.id = id;
        this.nombre = nombre;
        this.email = email;
        this.contraseña = contraseña;
        this.imagen = imagen;
        this.tipoEmpleado = tipoEmpleado;
        this.estado = estado;
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

    public String getContraseña() {
        return contraseña;
    }

    public void setContraseña(String contraseña) {
        this.contraseña = contraseña;
    }

    public String getImagen() {
        return imagen;
    }

    public void setImagen(String imagen) {
        this.imagen = imagen;
    }

    public TipoEmpleado getTipoEmpleado() {
        return tipoEmpleado;
    }

    public void setTipoEmpleado(TipoEmpleado tipoEmpleado) {
        this.tipoEmpleado = tipoEmpleado;
    }

    public Estado getEstado() {
        return estado;
    }

    public void setEstado(Estado estado) {
        this.estado = estado;
    }

    @Override
    public String toString() {
        return "Empleado [id=" + id + ", nombre=" + nombre + ", email=" + email +
                ", tipoEmpleado=" + tipoEmpleado + ", estado=" + estado + "]";
    }
}