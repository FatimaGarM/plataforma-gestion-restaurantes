package com.gestionqr.backend.service;

import com.gestionqr.backend.model.ConfiguracionRestaurante;
import com.gestionqr.backend.repository.ConfiguracionRestauranteRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class ConfiguracionRestauranteService {

    @Autowired
    private ConfiguracionRestauranteRepository configuracionRepository;

    @Autowired
    private ArchivoService archivoService;

    /**
     * Obtener la configuración (siempre es 1 solo registro).
     * Si no existe, crea uno con valores por defecto.
     */
    public ConfiguracionRestaurante obtenerConfiguracion() {
        return configuracionRepository.findAll().stream().findFirst()
                .orElseGet(() -> {
                    ConfiguracionRestaurante config = new ConfiguracionRestaurante();
                    config.setNombreRestaurante("Mi Restaurante");
                    config.setColorPrimario("#f59e0b");
                    config.setColorSecundario("#059669");
                    config.setIdiomaCarta("es");
                    return configuracionRepository.save(config);
                });
    }

    /**
     * Actualizar la configuración del restaurante.
     */
    public ConfiguracionRestaurante actualizarConfiguracion(
            String nombreRestaurante,
            String telefono,
            String direccion,
            String emailContacto,
            String colorPrimario,
            String colorSecundario,
            String idiomaCarta,
            MultipartFile logo,
            MultipartFile imagenFondo
    ) throws Exception {

        ConfiguracionRestaurante config = obtenerConfiguracion();

        config.setNombreRestaurante(nombreRestaurante);
        config.setTelefono(telefono);
        config.setDireccion(direccion);
        config.setEmailContacto(emailContacto);
        config.setColorPrimario(colorPrimario);
        config.setColorSecundario(colorSecundario);
        config.setIdiomaCarta(idiomaCarta);

        if (logo != null && !logo.isEmpty()) {
            archivoService.eliminarImagenConfiguracion(config.getLogo());
            String nombreArchivo = archivoService.guardarImagenConfiguracion(logo);
            config.setLogo(nombreArchivo);
        }

        if (imagenFondo != null && !imagenFondo.isEmpty()) {
            archivoService.eliminarImagenConfiguracion(config.getImagenFondo());
            String nombreArchivo = archivoService.guardarImagenConfiguracion(imagenFondo);
            config.setImagenFondo(nombreArchivo);
        }

        return configuracionRepository.save(config);
    }
}
