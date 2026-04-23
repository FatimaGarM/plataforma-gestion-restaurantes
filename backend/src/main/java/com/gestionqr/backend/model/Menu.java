package com.gestionqr.backend.model;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.gestionqr.backend.model.Menu.DiaMenu;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OrderBy;

@Entity
public class Menu {

	public enum DiaMenu {
		Lunes, Martes, Miercoles, Jueves, Viernes, Sabado, Domingo
	}

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	Long id;

	double precio;

	@Enumerated(EnumType.STRING)
	@Column(unique = true)
	private DiaMenu dia;

	/**
	 * Relación 1:N con Pedido
	 * Un servicio puede tener muchos pedidos
	 */
	@OneToMany(mappedBy = "menu", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
	@OrderBy("orden ASC")
	@JsonManagedReference
	private List<MenuPlato> items = new ArrayList<>();

	public Menu() {
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public double getPrecio() {
		return precio;
	}

	public void setPrecio(double precio) {
		this.precio = precio;
	}

	public DiaMenu getDia() {
		return dia;
	}

	public void setDia(DiaMenu dia) {
		this.dia = dia;
	}

	public List<MenuPlato> getItems() {
		return items;
	}

	public void setItems(List<MenuPlato> items) {
		this.items = items;
	}

	@Override
	public String toString() {
		return "Menu [id=" + id + ", precio=" + precio + ", dia=" + dia + ", items=" + items + "]";
	}

}