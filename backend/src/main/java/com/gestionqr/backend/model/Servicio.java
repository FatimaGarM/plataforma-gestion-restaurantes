package com.gestionqr.backend.model;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;

/**
 * Entidad que representa un servicio (mesa activa).
 * Un servicio contiene varios pedidos.
 */
@Entity
public class Servicio {

    public enum EstadoServicio {
        Abierto, Cerrado, Finalizado
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private EstadoServicio estado;

    private int mesa;

    /**
     * Relación 1:N con Pedido
     * Un servicio puede tener muchos pedidos
     */
    @OneToMany(mappedBy = "servicio", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JsonManagedReference
    private List<Pedido> pedidos;

    public Servicio() {
    }

    public Servicio(Long id, EstadoServicio estado, int mesa, List<Pedido> pedidos) {
        this.id = id;
        this.estado = estado;
        this.mesa = mesa;
        this.pedidos = pedidos;
    }

    public Long getId() {
        return id;
    }

    public EstadoServicio getEstado() {
        return estado;
    }

    public int getMesa() {
        return mesa;
    }

    public List<Pedido> getPedidos() {
        return pedidos;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setEstado(EstadoServicio estado) {
        this.estado = estado;
    }

    public void setMesa(int mesa) {
        this.mesa = mesa;
    }

    public void setPedidos(List<Pedido> pedidos) {
        this.pedidos = pedidos;
    }

    @Override
    public String toString() {
        return "Servicio [id=" + id +
                ", estado=" + estado +
                ", mesa=" + mesa +
                ", pedidos=" + pedidos + "]";
    }
}