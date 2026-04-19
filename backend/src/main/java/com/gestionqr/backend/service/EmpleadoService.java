package com.gestionqr.backend.service;

import com.gestionqr.backend.model.Empleado;
import com.gestionqr.backend.repository.EmpleadoRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

/**
 * Servicio que contiene la lógica de negocio relacionada con los empleados.
 */
@Service
public class EmpleadoService {

    @Autowired
    private EmpleadoRepository empleadoRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private ArchivoService archivoService;

    /**
     * Obtener todos los empleados ordenados por nombre.
     */
    public List<Empleado> obtenerEmpleados() {
        return empleadoRepository.findAll(Sort.by(Sort.Direction.ASC, "nombre"));
    }

    /**
     * Obtener un empleado por su ID.
     */
    public Optional<Empleado> obtenerEmpleadosById(Long id) {
        return empleadoRepository.findById(id);
    }

    /**
     * Crear un empleado sin imagen.
     */
    public Empleado crearEmpleado(Empleado empleado) {

        empleado.setContraseña(passwordEncoder.encode(empleado.getContraseña()));

        return empleadoRepository.save(empleado);
    }

    /**
     * Crear un empleado con imagen.
     */
    public Empleado crearEmpleadoConImagen(
            String nombre,
            String email,
            String contraseña,
            Empleado.TipoEmpleado tipoEmpleado,
            Empleado.Estado estado,
            MultipartFile imagen
    ) throws Exception {

        // usar servicio de archivos
        String nombreArchivo = archivoService.guardarImagenEmpleado(imagen);

        Empleado empleado = new Empleado();
        empleado.setNombre(nombre);
        empleado.setEmail(email);
        empleado.setContraseña(passwordEncoder.encode(contraseña));
        empleado.setTipoEmpleado(tipoEmpleado);
        empleado.setEstado(estado);
        empleado.setImagen(nombreArchivo);

        return empleadoRepository.save(empleado);
    }

    /**
     * Actualizar un empleado.
     */
    public Empleado actualizarEmpleado(
            Long id,
            String nombre,
            String email,
            String contraseña,
            Empleado.TipoEmpleado tipoEmpleado,
            Empleado.Estado estado,
            MultipartFile imagen
    ) throws Exception {

        Empleado empleado = empleadoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Empleado no encontrado"));

        empleado.setNombre(nombre);
        empleado.setEmail(email);
        empleado.setTipoEmpleado(tipoEmpleado);
        empleado.setEstado(estado);

        if (contraseña != null && !contraseña.isEmpty()) {
            empleado.setContraseña(passwordEncoder.encode(contraseña));
        }

        // gestión de imagen con ArchivoService
        if (imagen != null && !imagen.isEmpty()) {

            archivoService.eliminarImagenEmpleado(empleado.getImagen());

            String nombreArchivo = archivoService.guardarImagenEmpleado(imagen);
            empleado.setImagen(nombreArchivo);
        }

        return empleadoRepository.save(empleado);
    }

    /**
     * Eliminar empleado.
     */
    public void borrarEmpleado(Long id) throws Exception {

        Empleado empleado = empleadoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Empleado no encontrado"));

        archivoService.eliminarImagenEmpleado(empleado.getImagen());

        empleadoRepository.deleteById(id);
    }

    /**
     * Cambiar la contraseña de un empleado validando la actual.
     */
    public boolean cambiarContrasena(Long id, String contrasenaActual, String contrasenaNueva) {

        Empleado empleado = empleadoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Empleado no encontrado"));

        if (!passwordEncoder.matches(contrasenaActual, empleado.getContraseña())) {
            return false;
        }

        empleado.setContraseña(passwordEncoder.encode(contrasenaNueva));
        empleadoRepository.save(empleado);
        return true;
    }
}