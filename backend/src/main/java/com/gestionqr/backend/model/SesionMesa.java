package com.gestionqr.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class SesionMesa {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private int mesa;

    @Column(unique = true, nullable = false)
    private String token;

    @Column(nullable = false, length = 16)
    private String codigoAcceso;

    private LocalDateTime creadoEn = LocalDateTime.now();

    private LocalDateTime ultimaActividad = LocalDateTime.now();

    private boolean activa = true;

    public Long getId() { return id; }

    public int getMesa() { return mesa; }
    public void setMesa(int mesa) { this.mesa = mesa; }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public String getCodigoAcceso() { return codigoAcceso; }
    public void setCodigoAcceso(String codigoAcceso) { this.codigoAcceso = codigoAcceso; }

    public LocalDateTime getCreadoEn() { return creadoEn; }
    public void setCreadoEn(LocalDateTime creadoEn) { this.creadoEn = creadoEn; }

    public LocalDateTime getUltimaActividad() { return ultimaActividad; }
    public void setUltimaActividad(LocalDateTime ultimaActividad) { this.ultimaActividad = ultimaActividad; }

    public boolean isActiva() { return activa; }
    public void setActiva(boolean activa) { this.activa = activa; }

    @Column(nullable = false)
    private String modo = "PENDIENTE";

    private int contadorPersonas = 1;

    public String getModo() { return modo; }
    public void setModo(String modo) { this.modo = modo; }

    public int getContadorPersonas() { return contadorPersonas; }
    public void setContadorPersonas(int contadorPersonas) { this.contadorPersonas = contadorPersonas; }
}
