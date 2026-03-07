package com.gestionqr.backend.controller;

import org.springframework.data.domain.Sort;

import com.gestionqr.backend.model.Empleado;
import com.gestionqr.backend.repository.EmpleadoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/empleados")
public class EmpleadoController {

    @Autowired
    private EmpleadoRepository empleadoRepository;

    @GetMapping
    public List<Empleado> obtenerEmpleados() {
        return empleadoRepository.findAll(Sort.by(Sort.Direction.ASC, "nombre"));
    }
    
    @GetMapping("{id}")
    public Optional<Empleado> obtenerEmpleadosById(@PathVariable Long id) {
    	return empleadoRepository.findById(id);
    }

    @PostMapping
    public Empleado crearEmpleado(@RequestBody Empleado empleado) {    	
    	return empleadoRepository.save(empleado);
    }
    
    @PutMapping("/actualizar/{id}")
    public Empleado actualizarEmpleado(@PathVariable Long id,
    		@RequestParam String nombre,
            @RequestParam String email,
            @RequestParam String contraseña,
            @RequestParam Empleado.TipoEmpleado tipoEmpleado,
            @RequestParam Empleado.Estado estado,
            @RequestParam(name="imagen", required=false) MultipartFile imagen
            ) throws Exception {
    	String nombreArchivo = "";
    	
    	if(imagen != null) {
    		System.out.println("Imagen");
    		nombreArchivo = System.currentTimeMillis() + "_" + imagen.getOriginalFilename();

            Path ruta = Paths.get("uploads/FotosEmpleados/" + nombreArchivo);
            Files.createDirectories(ruta.getParent());
            Files.write(ruta, imagen.getBytes());
    	}
    	
    	Empleado empleado = new Empleado();
    	empleado.setId(id);
        empleado.setNombre(nombre);
        empleado.setEmail(email);
        empleado.setContraseña(contraseña);
        empleado.setTipoEmpleado(tipoEmpleado);
        empleado.setEstado(estado);
        if(nombreArchivo == "") {
        	empleado.setImagen(empleadoRepository.findById(id).get().getImagen());
        } else {
        	empleado.setImagen(nombreArchivo);
        	System.out.println(nombreArchivo);
        }    
        
    	return empleadoRepository.save(empleado);
    }
    
    @PostMapping("/con-imagen")
    public Empleado crearEmpleadoConImagen(
            @RequestParam String nombre,
            @RequestParam String email,
            @RequestParam String contraseña,
            @RequestParam Empleado.TipoEmpleado tipoEmpleado,
            @RequestParam Empleado.Estado estado,
            @RequestParam("imagen") MultipartFile imagen
    ) throws Exception {

        String nombreArchivo = System.currentTimeMillis() + "_" + imagen.getOriginalFilename();

        Path ruta = Paths.get("uploads/FotosEmpleados/" + nombreArchivo);
        Files.createDirectories(ruta.getParent());
        Files.write(ruta, imagen.getBytes());

        Empleado empleado = new Empleado();
        empleado.setNombre(nombre);
        empleado.setEmail(email);
        empleado.setContraseña(contraseña);
        empleado.setTipoEmpleado(tipoEmpleado);
        empleado.setEstado(estado);
        empleado.setImagen(nombreArchivo);

        return empleadoRepository.save(empleado);
    }
    
    @DeleteMapping("/{id}")
    public void borrarEmpleado(@PathVariable Long id) {
    	empleadoRepository.deleteById(id);
    }
    
}