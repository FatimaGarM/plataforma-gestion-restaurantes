package com.gestionqr.backend.controller;

import com.gestionqr.backend.model.Empleado;
import com.gestionqr.backend.service.EmpleadoService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * Controlador REST para la gestión de empleados.
 * Se encarga de recibir las peticiones HTTP y delegar la lógica al servicio.
 */
@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/empleados")
public class EmpleadoController {

    // Servicio donde está la lógica de negocio
    @Autowired
    private EmpleadoService empleadoService;

    /**
     * Obtener todos los empleados.
     */
    @GetMapping
    public List<Empleado> obtenerEmpleados() {
        return empleadoService.obtenerEmpleados();
    }

    /**
     * Obtener un empleado por su ID.
     */
    @GetMapping("/{id}")
    public Optional<Empleado> obtenerEmpleadoById(@PathVariable Long id) {
        return empleadoService.obtenerEmpleadosById(id);
    }

    /**
     * Crear un empleado sin imagen.
     * El cifrado de contraseña se realiza en el Service.
     */
    @PostMapping
    public Empleado crearEmpleado(@RequestBody Empleado empleado) {
        return empleadoService.crearEmpleado(empleado);
    }

    /**
     * Crear un empleado con imagen.
     * Los datos se envían como form-data.
     */
    @PostMapping("/con-imagen")
    public Empleado crearEmpleadoConImagen(
            @RequestParam String nombre,
            @RequestParam String email,
            @RequestParam String contraseña,
            @RequestParam Empleado.TipoEmpleado tipoEmpleado,
            @RequestParam Empleado.Estado estado,
            @RequestParam(name = "imagen", required = false) MultipartFile imagen
    ) throws Exception {

        return empleadoService.crearEmpleadoConImagen(
                nombre,
                email,
                contraseña,
                tipoEmpleado,
                estado,
                imagen
        );
    }

    /**
     * Actualizar un empleado existente.
     * Permite modificar datos, contraseña e imagen.
     */
    @PutMapping("/{id}")
    public Empleado actualizarEmpleado(
            @PathVariable Long id,
            @RequestParam String nombre,
            @RequestParam String email,
            @RequestParam(required = false) String contraseña,
            @RequestParam Empleado.TipoEmpleado tipoEmpleado,
            @RequestParam Empleado.Estado estado,
            @RequestParam(name = "imagen", required = false) MultipartFile imagen
    ) throws Exception {

        return empleadoService.actualizarEmpleado(
                id,
                nombre,
                email,
                contraseña,
                tipoEmpleado,
                estado,
                imagen
        );
    }

    /**
     * Eliminar un empleado por su ID.
     */
    @DeleteMapping("/{id}")
    public void borrarEmpleado(@PathVariable Long id) throws Exception {
        empleadoService.borrarEmpleado(id);
    }

    /**
     * Cambiar la contraseña de un empleado.
     * Requiere la contraseña actual para validar.
     */
    @PutMapping("/{id}/contrasena")
    public ResponseEntity<?> cambiarContrasena(
            @PathVariable Long id,
            @RequestBody Map<String, String> body
    ) {
        String actual = body.get("contrasenaActual");
        String nueva = body.get("contrasenaNueva");

        boolean resultado = empleadoService.cambiarContrasena(id, actual, nueva);

        if (resultado) {
            return ResponseEntity.ok(Map.of("mensaje", "Contraseña actualizada correctamente"));
        } else {
            return ResponseEntity.badRequest().body(Map.of("error", "La contraseña actual no es correcta"));
        }
    }
}