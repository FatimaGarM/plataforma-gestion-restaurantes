package com.gestionqr.backend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;


@Entity
public class Empleado {
	
	enum TipoEmpleado{
		Camarero, Cocinero, Gerente;
	}

	enum Estado{
		Descanso, Vacaciones, Activo;
	}

	 @Id
	    @GeneratedValue(strategy = GenerationType.IDENTITY)
	    private Long id;

	    private String nombre;
	    private String email;
	    private String contraseña;
	    private TipoEmpleado tipoEmpleado;
	    private Estado estado;
	    
		public Empleado() {
		}

		public Empleado(Long id, String nombre, String email, String contraseña, TipoEmpleado tipoEmpleado,
				Estado estado) {
			this.id = id;
			this.nombre = nombre;
			this.email = email;
			this.contraseña = contraseña;
			this.tipoEmpleado = tipoEmpleado;
			this.estado = estado;
		}

		public Long getId() {
			return id;
		}

		public void setId(Long id) {
			this.id = id;
		}

		public String getNombre() {
			return nombre;
		}

		public void setNombre(String nombre) {
			this.nombre = nombre;
		}

		public String getEmail() {
			return email;
		}

		public void setEmail(String email) {
			this.email = email;
		}

		public String getContraseña() {
			return contraseña;
		}

		public void setContraseña(String contraseña) {
			this.contraseña = contraseña;
		}

		public TipoEmpleado getTipoEmpleado() {
			return tipoEmpleado;
		}

		public void setTipoEmpleado(TipoEmpleado tipoEmpleado) {
			this.tipoEmpleado = tipoEmpleado;
		}

		public Estado getEstado() {
			return estado;
		}

		public void setEstado(Estado estado) {
			this.estado = estado;
		}

		@Override
		public String toString() {
			return "Empleado [id=" + id + ", nombre=" + nombre + ", email=" + email + ", contraseña=" + contraseña
					+ ", tipoEmpleado=" + tipoEmpleado + ", estado=" + estado + "]";
		}
	    
	    
	    
	    
	    
}
