package com.gestionqr.backend.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;

@Entity
public class ItemSeccion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private int orden;

    @ManyToOne
    @JoinColumn(name = "seccion_id")
    @JsonBackReference
    private SeccionCarta seccion;

    @ManyToOne
    @JoinColumn(name = "plato_id")
    private Plato plato;

    public ItemSeccion() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public int getOrden() { return orden; }
    public void setOrden(int orden) { this.orden = orden; }

    public SeccionCarta getSeccion() { return seccion; }
    public void setSeccion(SeccionCarta seccion) { this.seccion = seccion; }

    public Plato getPlato() { return plato; }
    public void setPlato(Plato plato) { this.plato = plato; }
}
