package com.gestionqr.backend.service;

import com.gestionqr.backend.model.Empleado;
import com.gestionqr.backend.model.repository.EmpleadoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private EmpleadoRepository empleadoRepository;

    public Empleado obtenerEmpleadoAutenticado(String email) {
        Empleado e = empleadoRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Empleado no encontrado"));
        e.setContraseña(null);
        return e;
    }
}