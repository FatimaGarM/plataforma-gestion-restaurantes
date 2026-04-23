package com.gestionqr.backend.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
public class Servicio {

    public enum EstadoServicio {
        Abierto, Cerrado, Finalizado
    }

    public enum MetodoPagoSolicitado {
        METALICO, TARJETA, BIZUM
    }

    public enum EstadoCobro {
        SIN_SOLICITUD, PENDIENTE_COBRO, COBRANDO, COBRADO_PARCIAL, COBRADO_TOTAL
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.ORDINAL)
    private EstadoServicio estado;

    private int mesa;

    @Enumerated(EnumType.STRING)
    private MetodoPagoSolicitado metodoPagoSolicitado;

    @Enumerated(EnumType.STRING)
    private EstadoCobro estadoCobro = EstadoCobro.SIN_SOLICITUD;

    private LocalDateTime fechaSolicitudCobro;

    private LocalDateTime ultimaActividad = LocalDateTime.now();

    @OneToMany(mappedBy = "servicio", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JsonManagedReference("servicio-pedidos")
    private List<Pedido> pedidos = new ArrayList<>();

    @OneToMany(mappedBy = "servicio", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @JsonManagedReference("servicio-cobros")
    private List<CobroPersona> cobrosPersona = new ArrayList<>();

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

    public MetodoPagoSolicitado getMetodoPagoSolicitado() {
        return metodoPagoSolicitado;
    }

    public EstadoCobro getEstadoCobro() {
        return estadoCobro;
    }

    public LocalDateTime getFechaSolicitudCobro() {
        return fechaSolicitudCobro;
    }

    public LocalDateTime getUltimaActividad() {
        return ultimaActividad;
    }

    public List<Pedido> getPedidos() {
        return pedidos;
    }

    public List<CobroPersona> getCobrosPersona() {
        return cobrosPersona;
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

    public void setMetodoPagoSolicitado(MetodoPagoSolicitado metodoPagoSolicitado) {
        this.metodoPagoSolicitado = metodoPagoSolicitado;
    }

    public void setEstadoCobro(EstadoCobro estadoCobro) {
        this.estadoCobro = estadoCobro;
    }

    public void setFechaSolicitudCobro(LocalDateTime fechaSolicitudCobro) {
        this.fechaSolicitudCobro = fechaSolicitudCobro;
    }

    public void setUltimaActividad(LocalDateTime ultimaActividad) {
        this.ultimaActividad = ultimaActividad;
    }

    public void setPedidos(List<Pedido> pedidos) {
        this.pedidos = pedidos;
    }

    public void setCobrosPersona(List<CobroPersona> cobrosPersona) {
        this.cobrosPersona = cobrosPersona;
    }

    @Override
    public String toString() {
        return "Servicio [id=" + id +
                ", estado=" + estado +
                ", mesa=" + mesa +
                ", metodoPagoSolicitado=" + metodoPagoSolicitado +
                ", estadoCobro=" + estadoCobro +
                ", pedidos=" + pedidos + "]";
    }
}
