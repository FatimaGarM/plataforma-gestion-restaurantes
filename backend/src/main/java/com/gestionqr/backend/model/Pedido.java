package com.gestionqr.backend.model;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonValue;

import jakarta.persistence.*;

@Entity
public class Pedido {

	public enum EstadoPedido {

	    Pendiente("Pendiente"),
	    EnProceso("En proceso"),
	    Listo("Listo"),
	    Servido("Servido"),
	    Cancelado("Cancelado");

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
    @JsonBackReference("servicio-pedidos")
    private Servicio servicio;

    private Integer persona;

    @ManyToOne
    @JoinColumn(name = "comensal_id")
    private Comensal comensal;

    @Column(name = "precio_unitario")
    private double precioUnitario = 0;

    @Column(name = "es_menu")
    private boolean esMenu = false;

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

    public Integer getPersona() { return persona; }
    public void setPersona(Integer persona) { this.persona = persona; }

    public Comensal getComensal() { return comensal; }
    public void setComensal(Comensal comensal) { this.comensal = comensal; }

    public double getPrecioUnitario() { return precioUnitario; }
    public void setPrecioUnitario(double precioUnitario) { this.precioUnitario = precioUnitario; }

    public boolean isEsMenu() { return esMenu; }
    public void setEsMenu(boolean esMenu) { this.esMenu = esMenu; }

    @Override
    public String toString() {
        return "Pedido [id=" + id +
                ", plato=" + plato +
                ", mesa=" + mesa +
                ", persona=" + persona +
                ", estado=" + estado + "]";
    }
}
