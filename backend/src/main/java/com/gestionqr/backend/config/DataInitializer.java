package com.gestionqr.backend.config;

import com.gestionqr.backend.model.Empleado;
import com.gestionqr.backend.model.repository.EmpleadoRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final String HASH_CORRUPTO =
            "$2a$10$Dow1QyGJ0v7FpC18JNpDne6N9KuX3sX5Yucs5cjox96D65gis6pZe";

    @Autowired
    private EmpleadoRepository empleadoRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        List<Empleado> empleados = empleadoRepository.findAll();
        for (Empleado emp : empleados) {
            if (HASH_CORRUPTO.equals(emp.getContraseña())) {
                emp.setContraseña(passwordEncoder.encode("1234"));
                empleadoRepository.save(emp);
            }
        }
    }
}

