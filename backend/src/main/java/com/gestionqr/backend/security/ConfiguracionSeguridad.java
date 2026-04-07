package com.gestionqr.backend.security;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
public class ConfiguracionSeguridad {

    @Bean
    public SecurityFilterChain filtroSeguridad(HttpSecurity http) throws Exception {

        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session ->
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth

                // Imágenes y recursos estáticos — públicos (para la carta QR del cliente)
                .requestMatchers("/uploads/**").permitAll()

                // Endpoint de autenticación — cualquier empleado autenticado puede usarlo
                .requestMatchers("/auth/me").authenticated()

                // Cualquier usuario autenticado puede cambiar su propia contraseña
                .requestMatchers(HttpMethod.PUT, "/empleados/*/contrasena").authenticated()

                // Gestión de empleados — solo GERENTE
                .requestMatchers("/empleados/**").hasRole("GERENTE")

                // Carta — GET autenticado, modificaciones solo GERENTE
                .requestMatchers(HttpMethod.GET, "/platos/**").authenticated()
                .requestMatchers("/platos/**").hasRole("GERENTE")

                // Configuración del restaurante — solo GERENTE
                .requestMatchers("/configuracion/**").hasRole("GERENTE")

                // Estadísticas — solo GERENTE
                .requestMatchers("/estadisticas/**").hasRole("GERENTE")

                // Pedidos y servicios — cualquier empleado autenticado
                .requestMatchers("/pedidos/**").authenticated()
                .requestMatchers("/servicios/**").authenticated()

                // Cualquier otra ruta — autenticado
                .anyRequest().authenticated()
            )
            .httpBasic(basic -> basic.authenticationEntryPoint(
                (request, response, authException) -> {
                    // Sin WWW-Authenticate para evitar el diálogo nativo del navegador
                    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                    response.setContentType("application/json;charset=UTF-8");
                    response.getWriter().write("{\"error\":\"No autorizado\"}");
                }
            ));

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOriginPatterns(List.of("http://localhost:*"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}