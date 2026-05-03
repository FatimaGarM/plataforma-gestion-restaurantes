package com.gestionqr.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

@Entity
public class Comensal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "sesion_mesa_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private SesionMesa sesionMesa;

    private Integer numero;

    private String nombre;

    public Comensal() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public SesionMesa getSesionMesa() { return sesionMesa; }
    public void setSesionMesa(SesionMesa sesionMesa) { this.sesionMesa = sesionMesa; }

    public Integer getNumero() { return numero; }
    public void setNumero(Integer numero) { this.numero = numero; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
}
