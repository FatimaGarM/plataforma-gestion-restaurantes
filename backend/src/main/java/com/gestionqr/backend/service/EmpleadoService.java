package com.gestionqr.backend.service;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import com.gestionqr.backend.model.Empleado;
import com.gestionqr.backend.repository.EmpleadoRepository;

public class EmpleadoService {
	
	@Autowired
    private EmpleadoRepository empleadoRepository;

    public List<Empleado> obtenerEmpleados() {
        return empleadoRepository.findAll(Sort.by(Sort.Direction.ASC, "nombre"));
    }
    
    public Optional<Empleado> obtenerEmpleadosById(Long id) {
    	return empleadoRepository.findById(id);
    }

    public Empleado crearEmpleado(@RequestBody Empleado empleado) {    	
    	return empleadoRepository.save(empleado);
    }
    
    public Empleado actualizarEmpleado( Long id,
    		 String nombre,
             String email,
             String contraseña,
             Empleado.TipoEmpleado tipoEmpleado,
             Empleado.Estado estado,
            MultipartFile imagen
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
    
    public Empleado crearEmpleadoConImagen(
             String nombre,
             String email,
             String contraseña,
             Empleado.TipoEmpleado tipoEmpleado,
             Empleado.Estado estado,
             MultipartFile imagen
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
    
    public void borrarEmpleado(Long id)  throws Exception {
    	String nombreArchivo = empleadoRepository.findById(id).get().getImagen();
    	
    	Path ruta = Paths.get("uploads/FotosEmpleados/" + nombreArchivo);
        Files.deleteIfExists(ruta);
        
        empleadoRepository.deleteById(id);
    }
}
