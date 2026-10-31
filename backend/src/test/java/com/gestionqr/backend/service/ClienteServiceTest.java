package com.gestionqr.backend.service;

import com.gestionqr.backend.model.Comensal;
import com.gestionqr.backend.model.Plato;
import com.gestionqr.backend.model.Servicio;
import com.gestionqr.backend.model.Servicio.EstadoServicio;
import com.gestionqr.backend.model.SesionMesa;
import com.gestionqr.backend.model.repository.ComensalRepository;
import com.gestionqr.backend.model.repository.MenuRepository;
import com.gestionqr.backend.model.repository.PedidoRepository;
import com.gestionqr.backend.model.repository.PlatoRepository;
import com.gestionqr.backend.model.repository.ServicioRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

class ClienteServiceTest {

    @Mock private ComensalRepository comensalRepository;
    @Mock private ServicioRepository servicioRepository;
    @Mock private PlatoRepository platoRepository;
    @Mock private MenuRepository menuRepository;
    @Mock private PedidoRepository pedidoRepository;

    @InjectMocks
    private ClienteService clienteService;

    private SesionMesa sesion;
    private Servicio servicio;
    private Plato plato;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        sesion = new SesionMesa();
        sesion.setMesa(3);

        plato = new Plato();
        plato.setId(1L);
        plato.setPrecio(10.0);

        servicio = new Servicio();
        servicio.setMesa(3);
        servicio.setEstado(EstadoServicio.Abierto);
        servicio.setPedidos(new ArrayList<>());

        when(servicioRepository.findFirstByMesaAndEstado(anyInt(), eq(EstadoServicio.Abierto)))
                .thenReturn(Optional.of(servicio));
        when(platoRepository.findById(1L)).thenReturn(Optional.of(plato));
        when(servicioRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));
    }

    @Test
    void registrarComensal_devuelveExistente_cuandoNumeroYaExisteEnSesion() {
        Comensal existente = new Comensal();
        existente.setNumero(2);
        when(comensalRepository.findBySesionMesaAndNumero(sesion, 2))
                .thenReturn(Optional.of(existente));

        Comensal resultado = clienteService.registrarComensal(sesion, 2, "Juan");

        assertSame(existente, resultado);
    }

    @Test
    void registrarComensal_creaComensalNuevo_cuandoNumeroNoExiste() {
        when(comensalRepository.findBySesionMesaAndNumero(sesion, 3))
                .thenReturn(Optional.empty());
        when(comensalRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));

        Comensal resultado = clienteService.registrarComensal(sesion, 3, "Maria");

        assertEquals(3, resultado.getNumero());
    }

    @Test
    void crearPedido_lanzaExcepcion_cuandoPlatoNoExiste() {
        when(platoRepository.findById(99L)).thenReturn(Optional.empty());

        Map<String, Object> item = Map.of("platoId", 99L);

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> clienteService.crearPedido(sesion, List.of(item)));

        assertTrue(ex.getMessage().contains("99"));
    }

    @Test
    void crearPedido_lanzaExcepcion_cuandoMenuYaPedidoPorComensal() {
        Comensal comensal = new Comensal();
        when(comensalRepository.findByIdWithLock(5L)).thenReturn(Optional.of(comensal));
        when(pedidoRepository.existsByComensalAndEsMenuTrueAndEstadoIn(eq(comensal), any()))
                .thenReturn(true);

        Map<String, Object> item = Map.of("platoId", 1L, "comensalId", 5L, "esMenu", true);

        IllegalStateException ex = assertThrows(IllegalStateException.class,
                () -> clienteService.crearPedido(sesion, List.of(item)));

        assertTrue(ex.getMessage().startsWith("MENU_YA_PEDIDO:"));
    }
}
