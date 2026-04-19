package com.gestionqr.backend.controller;

import com.gestionqr.backend.model.Empleado;
import com.gestionqr.backend.repository.EmpleadoRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private EmpleadoRepository empleadoRepository;

    /**
     * Devuelve los datos del empleado autenticado.
     * Accesible por cualquier rol (GERENTE, CAMARERO, COCINERO).
     */
    @GetMapping("/me")
    public ResponseEntity<?> me(Authentication authentication) {
        String email = authentication.getName();
        Optional<Empleado> emp = empleadoRepository.findByEmail(email);
        if (emp.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Empleado e = emp.get();
        // Nunca devolver la contraseña hasheada al frontend
        e.setContraseña(null);
        return ResponseEntity.ok(e);
    }
}
