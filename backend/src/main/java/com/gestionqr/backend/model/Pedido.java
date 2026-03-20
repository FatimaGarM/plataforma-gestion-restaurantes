package com.gestionqr.backend.model;


import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class Pedido {
	public enum EstadoPedido{
		Pendiente, EnProceso, Listo, Servido;
	}

	 @Id
	    @GeneratedValue(strategy = GenerationType.IDENTITY)
	    private Long id;
	 	
	    private int mesa;
	    private EstadoPedido estado;
	    
	    @ManyToOne
	 	@JoinColumn(name = "plato_id")
	    private Plato plato;
	    
	    @ManyToOne
	    @JoinColumn(name = "servicio_id")
	    @JsonBackReference
	    private Servicio servicio;

		public Pedido() {
		}

		public Pedido(Long id, Plato plato, int mesa, EstadoPedido estado, Servicio servicio) {
			this.id = id;
			this.plato = plato;
			this.mesa = mesa;
			this.estado = estado;
			this.servicio = servicio;
		}

		public Long getId() {
			return id;
		}

		public void setId(Long id) {
			this.id = id;
		}

		public Plato getPlato() {
			return plato;
		}

		public void setPlato(Plato plato) {
			this.plato = plato;
		}

		public int getMesa() {
			return mesa;
		}

		public void setMesa(int mesa) {
			this.mesa = mesa;
		}

		public EstadoPedido getEstado() {
			return estado;
		}

		public void setEstado(EstadoPedido estado) {
			this.estado = estado;
		}

		public Servicio getServicio() {
			return servicio;
		}

		public void setServicio(Servicio servicio) {
			this.servicio = servicio;
		}

		@Override
		public String toString() {
			return "Pedido [id=" + id + ", plato=" + plato + ", mesa=" + mesa + ", estado=" + estado + ", Servicio="
					+ servicio + "]";
		}
	    
	    
}

