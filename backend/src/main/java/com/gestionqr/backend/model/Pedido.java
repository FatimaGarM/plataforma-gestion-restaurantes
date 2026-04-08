package com.gestionqr.backend.model;

import java.time.LocalDateTime;
import java.time.LocalTime;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonValue;

import jakarta.persistence.*;

@Entity
public class Pedido {

	public enum EstadoPedido {

	    Pendiente("Pendiente"),
	    EnProceso("En proceso"),
	    Listo("Listo"),
	    Servido("Servido");

	    private final String descripcion;

	    EstadoPedido(String descripcion) {
	        this.descripcion = descripcion;
	    }
	    
	    @JsonValue
	    public String getDescripcion() {
	        return descripcion;
	    }
	}

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private int mesa;

    @Column(name = "fecha_hora")
    private LocalDateTime fechaHora;
    
    @Column(name = "fecha_hora_listo")
    private LocalDateTime fechaHoraListo;
    
    @PrePersist
    protected void onCreate() {
        if (this.fechaHora == null) {
            this.fechaHora = LocalDateTime.now();
        }
    }

    @Enumerated(EnumType.STRING)
    private EstadoPedido estado;

    @ManyToOne
    @JoinColumn(name = "plato_id")
    private Plato plato;

    @ManyToOne
    @JoinColumn(name = "servicio_id")
    @JsonBackReference
    private Servicio servicio;

    public Pedido() {}

    public Pedido(Long id, Plato plato, int mesa, EstadoPedido estado, Servicio servicio) {
        this.id = id;
        this.plato = plato;
        this.mesa = mesa;
        this.estado = estado;
        this.servicio = servicio;
    }

    public Long getId() { return id; }

    public void setId(Long id) { this.id = id; }

    public Plato getPlato() { return plato; }

    public void setPlato(Plato plato) { this.plato = plato; }

    public int getMesa() { return mesa; }

    public void setMesa(int mesa) { this.mesa = mesa; }

    public EstadoPedido getEstado() { return estado; }

    public void setEstado(EstadoPedido estado) { this.estado = estado; }

    public Servicio getServicio() { return servicio; }

    public void setServicio(Servicio servicio) { this.servicio = servicio; }

    public LocalDateTime getFechaHora() { return fechaHora; }

    public void setFechaHora(LocalDateTime fechaHora) { this.fechaHora = fechaHora; }

    public LocalDateTime getFechaHoraListo() {
		return fechaHoraListo;
	}

	public void setFechaHoraListo(LocalDateTime fechaHoraListo) {
		this.fechaHoraListo = fechaHoraListo;
	}

	@Override
    public String toString() {
        return "Pedido [id=" + id +
                ", plato=" + plato +
                ", mesa=" + mesa +
                ", estado=" + estado + "]";
    }
}