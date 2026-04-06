package com.gestionqr.backend.request;

import java.util.List;

/**
 * DTO para crear un servicio.
 * Recibe los IDs de los platos y la mesa.
 */
public class CrearServicioRequest {

    private List<Long> platosIds;
    private int mesa;

    public List<Long> getPlatosIds() {
        return platosIds;
    }

    public void setPlatosIds(List<Long> platosIds) {
        this.platosIds = platosIds;
    }

    public int getMesa() {
        return mesa;
    }

    public void setMesa(int mesa) {
        this.mesa = mesa;
    }
}