package com.gestionqr.backend.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
public class SeccionCarta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombre;

    private String nombreEn;

    private int orden;

    @ManyToOne
    @JoinColumn(name = "carta_id")
    @JsonBackReference
    private Carta carta;

    @OneToMany(mappedBy = "seccion", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("orden ASC")
    private List<ItemSeccion> items = new ArrayList<>();

    public SeccionCarta() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getNombreEn() { return nombreEn; }
    public void setNombreEn(String nombreEn) { this.nombreEn = nombreEn; }

    public int getOrden() { return orden; }
    public void setOrden(int orden) { this.orden = orden; }

    public Carta getCarta() { return carta; }
    public void setCarta(Carta carta) { this.carta = carta; }

    public List<ItemSeccion> getItems() { return items; }
    public void setItems(List<ItemSeccion> items) { this.items = items; }
}
