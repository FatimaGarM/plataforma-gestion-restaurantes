package com.gestionqr.backend.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class ConfiguracionSeguridad {

    // Configuración de seguridad (quién puede acceder a qué)
    @Bean
    public SecurityFilterChain filtroSeguridad(HttpSecurity http) throws Exception {

        http
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                //  TEMPORAL: permitir todo para poder trabajar y hacer pruebas
                .requestMatchers("/empleados/**").permitAll()
                .requestMatchers("/platos/**").permitAll()
                .anyRequest().permitAll()
            );

        return http.build();
    }

    // Cifrado de contraseñas
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}