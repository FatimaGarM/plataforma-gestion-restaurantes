package com.gestionqr.backend.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

/**
 * Servicio encargado de gestionar archivos (subida y eliminación).
 */
@Service
public class ArchivoService {

    private final String RUTA_EMPLEADOS = "uploads/FotosEmpleados/";

    public String guardarImagenEmpleado(MultipartFile imagen) throws Exception {

        if (imagen == null || imagen.isEmpty())
            return "";

        String nombreArchivo = System.currentTimeMillis() + "_" + imagen.getOriginalFilename();

        Path ruta = Paths.get(RUTA_EMPLEADOS + nombreArchivo);
        Files.createDirectories(ruta.getParent());
        Files.write(ruta, imagen.getBytes());

        return nombreArchivo;
    }

    public void eliminarImagenEmpleado(String nombreArchivo) throws Exception {

        if (nombreArchivo == null || nombreArchivo.isEmpty())
            return;

        Path ruta = Paths.get(RUTA_EMPLEADOS + nombreArchivo);
        Files.deleteIfExists(ruta);
    }

    private final String RUTA_PLATOS = "uploads/FotoPlatos/";

    public String guardarImagenPlato(MultipartFile imagen) throws Exception {

        if (imagen == null || imagen.isEmpty())
            return "";

        String nombreArchivo = System.currentTimeMillis() + "_" + imagen.getOriginalFilename();

        Path ruta = Paths.get(RUTA_PLATOS + nombreArchivo);
        Files.createDirectories(ruta.getParent());
        Files.write(ruta, imagen.getBytes());

        return nombreArchivo;
    }

    public void eliminarImagenPlato(String nombreArchivo) throws Exception {

        if (nombreArchivo == null || nombreArchivo.isEmpty())
            return;

        Path ruta = Paths.get(RUTA_PLATOS + nombreArchivo);
        Files.deleteIfExists(ruta);
    }
}