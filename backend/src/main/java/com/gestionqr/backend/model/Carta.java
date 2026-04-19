package com.gestionqr.backend.model;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
public class Carta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombre;

    private String imagenBanner;

    @OneToMany(mappedBy = "carta", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("orden ASC")
    private List<SeccionCarta> secciones = new ArrayList<>();

    public Carta() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getImagenBanner() { return imagenBanner; }
    public void setImagenBanner(String imagenBanner) { this.imagenBanner = imagenBanner; }

    public List<SeccionCarta> getSecciones() { return secciones; }
    public void setSecciones(List<SeccionCarta> secciones) { this.secciones = secciones; }
}
