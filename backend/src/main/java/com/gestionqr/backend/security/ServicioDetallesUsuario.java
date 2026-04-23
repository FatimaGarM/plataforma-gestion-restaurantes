package com.gestionqr.backend.security;

import com.gestionqr.backend.model.Empleado;
import com.gestionqr.backend.model.repository.EmpleadoRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

@Service
public class ServicioDetallesUsuario implements UserDetailsService {

    @Autowired
    private EmpleadoRepository empleadoRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {

        // Aquí buscamos el empleado por email
        Empleado emp = empleadoRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Empleado no encontrado"));

        // después lo convertimos, Empleado en usuario de Spring
        return User.builder()
                .username(emp.getEmail())
                .password(emp.getContraseña())
                .roles(emp.getTipoEmpleado().name()) // CAMARERO, COCINERO, GERENTE
                .build();
    }
}
