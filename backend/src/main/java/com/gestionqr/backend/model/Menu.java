package com.gestionqr.backend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;

@Entity
public class Menu {
	
	@Id
	Long id;
	
	String nombre;
	
	Plato primerplato;
	Plato segundoPlato;
	Plato postre;
	Plato bebida;
	
}
