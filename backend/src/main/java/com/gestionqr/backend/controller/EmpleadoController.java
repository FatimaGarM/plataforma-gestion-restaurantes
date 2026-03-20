package com.gestionqr.backend.controller;

import org.springframework.data.domain.Sort;
import com.gestionqr.backend.model.Empleado;
import com.gestionqr.backend.repository.EmpleadoRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import org.springframework.security.crypto.password.PasswordEncoder;

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

    @Autowired
    private PasswordEncoder passwordEncoder;

    // Obtener todos
    @GetMapping
    public List<Empleado> obtenerEmpleados() {
        return empleadoRepository.findAll(Sort.by(Sort.Direction.ASC, "nombre"));
    }

    // Obtener por ID
    @GetMapping("/{id}")
    public Optional<Empleado> obtenerEmpleadoById(@PathVariable Long id) {
        return empleadoRepository.findById(id);
    }

    // Crear empleado SIN imagen
    @PostMapping
    public Empleado crearEmpleado(@RequestBody Empleado empleado) {

        empleado.setContraseña(passwordEncoder.encode(empleado.getContraseña()));

        return empleadoRepository.save(empleado);
    }

    // Crear empleado CON imagen
    @PostMapping("/con-imagen")
    public Empleado crearEmpleadoConImagen(
            @RequestParam String nombre,
            @RequestParam String email,
            @RequestParam String contraseña,
            @RequestParam Empleado.TipoEmpleado tipoEmpleado,
            @RequestParam Empleado.Estado estado,
            @RequestParam(name = "imagen", required = false) MultipartFile imagen) throws Exception {

        String nombreArchivo = "";

        if (imagen != null && !imagen.isEmpty()) {
            nombreArchivo = System.currentTimeMillis() + "_" + imagen.getOriginalFilename();

            Path ruta = Paths.get("uploads/FotosEmpleados/" + nombreArchivo);
            Files.createDirectories(ruta.getParent());
            Files.write(ruta, imagen.getBytes());
        }

        Empleado empleado = new Empleado();
        empleado.setNombre(nombre);
        empleado.setEmail(email);
        empleado.setContraseña(passwordEncoder.encode(contraseña));
        empleado.setTipoEmpleado(tipoEmpleado);
        empleado.setEstado(estado);
        empleado.setImagen(nombreArchivo);

        return empleadoRepository.save(empleado);
    }

    // ACTUALIZAR empleado
    @PutMapping("/{id}")
    public Empleado actualizarEmpleado(
            @PathVariable Long id,
            @RequestParam String nombre,
            @RequestParam String email,
            @RequestParam(required = false) String contraseña,
            @RequestParam Empleado.TipoEmpleado tipoEmpleado,
            @RequestParam Empleado.Estado estado,
            @RequestParam(name = "imagen", required = false) MultipartFile imagen) throws Exception {

        Empleado empleado = empleadoRepository.findById(id).get();

        empleado.setNombre(nombre);
        empleado.setEmail(email);

        // solo actualiza contraseña si viene
        if (contraseña != null && !contraseña.isEmpty()) {
            empleado.setContraseña(passwordEncoder.encode(contraseña));
        }

        empleado.setTipoEmpleado(tipoEmpleado);
        empleado.setEstado(estado);

        // manejar la imagen
        if (imagen != null && !imagen.isEmpty()) {

            String imagenAntigua = empleado.getImagen();

            String nombreArchivo = System.currentTimeMillis() + "_" + imagen.getOriginalFilename();

            Path rutaNueva = Paths.get("uploads/FotosEmpleados/" + nombreArchivo);
            Files.createDirectories(rutaNueva.getParent());
            Files.write(rutaNueva, imagen.getBytes());

            empleado.setImagen(nombreArchivo);

            if (imagenAntigua != null && !imagenAntigua.isEmpty()) {
                Path rutaAntigua = Paths.get("uploads/FotosEmpleados/" + imagenAntigua);
                Files.deleteIfExists(rutaAntigua);
            }
        }

        return empleadoRepository.save(empleado);
    }

    // Cambiar estado para frontend tipo badge 
    @PutMapping("/{id}/estado")
    public Empleado cambiarEstado(@PathVariable Long id) {

        Empleado empleado = empleadoRepository.findById(id).get();

        // ejemplo simple de cambio
        if (empleado.getEstado() == Empleado.Estado.ACTIVO) {
            empleado.setEstado(Empleado.Estado.DESCANSO);
        } else {
            empleado.setEstado(Empleado.Estado.ACTIVO);
        }

        return empleadoRepository.save(empleado);
    }

    // Eliminar empleado y imagen
    @DeleteMapping("/{id}")
    public void borrarEmpleado(@PathVariable Long id) throws Exception {

        Empleado empleado = empleadoRepository.findById(id).get();

        String nombreArchivo = empleado.getImagen();

        if (nombreArchivo != null && !nombreArchivo.isEmpty()) {
            Path ruta = Paths.get("uploads/FotosEmpleados/" + nombreArchivo);
            Files.deleteIfExists(ruta);
        }

        empleadoRepository.deleteById(id);
    }
}