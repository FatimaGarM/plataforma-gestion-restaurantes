package com.gestionqr.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "llamada_camarero")
public class LlamadaCamarero {

    public enum TipoLlamada { PEDIR_CUENTA, LLAMAR_CAMARERO }
    public enum EstadoLlamada { PENDIENTE, ATENDIDA, CANCELADA }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "servicio_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "pedidos", "cobrosPersona"})
    private Servicio servicio;

    @ManyToOne
    @JoinColumn(name = "sesion_mesa_id")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private SesionMesa sesionMesa;

    @Enumerated(EnumType.STRING)
    private TipoLlamada tipo;

    @Enumerated(EnumType.STRING)
    private EstadoLlamada estado;

    @Column(name = "metodo_pago")
    private String metodoPago;

    @Column(name = "fecha_creacion")
    private LocalDateTime fechaCreacion;

    @Column(name = "fecha_atencion")
    private LocalDateTime fechaAtencion;

    @PrePersist
    protected void onCreate() {
        if (this.fechaCreacion == null) this.fechaCreacion = LocalDateTime.now();
        if (this.estado == null) this.estado = EstadoLlamada.PENDIENTE;
    }

    public LlamadaCamarero() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Servicio getServicio() { return servicio; }
    public void setServicio(Servicio servicio) { this.servicio = servicio; }

    public SesionMesa getSesionMesa() { return sesionMesa; }
    public void setSesionMesa(SesionMesa sesionMesa) { this.sesionMesa = sesionMesa; }

    public TipoLlamada getTipo() { return tipo; }
    public void setTipo(TipoLlamada tipo) { this.tipo = tipo; }

    public EstadoLlamada getEstado() { return estado; }
    public void setEstado(EstadoLlamada estado) { this.estado = estado; }

    public String getMetodoPago() { return metodoPago; }
    public void setMetodoPago(String metodoPago) { this.metodoPago = metodoPago; }

    public LocalDateTime getFechaCreacion() { return fechaCreacion; }
    public void setFechaCreacion(LocalDateTime fechaCreacion) { this.fechaCreacion = fechaCreacion; }

    public LocalDateTime getFechaAtencion() { return fechaAtencion; }
    public void setFechaAtencion(LocalDateTime fechaAtencion) { this.fechaAtencion = fechaAtencion; }
}
