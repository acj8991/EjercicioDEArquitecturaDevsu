package com.bp.clientes;

import com.bp.clientes.adapter.ComplementarioAdapter;
import com.bp.clientes.adapter.CoreBancarioAdapter;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

/**
 * Orquesta la obtencion de datos de cliente combinando el Core Bancario
 * (fuente de verdad de productos y movimientos) con el Sistema de
 * Informacion Complementaria (datos extendidos) -- ver PDF, seccion
 * "Diagrama de Componentes" / Servicio de Clientes.
 *
 * Se implementa en Java + Spring Boot porque requiere transformacion y
 * conciliacion de dos modelos externos distintos antes de exponer un unico
 * contrato de dominio al BFF (Anti-Corruption Layer).
 */
@Service
public class ClientesService {

    private final CoreBancarioAdapter core;
    private final ComplementarioAdapter complementario;

    public ClientesService(CoreBancarioAdapter core, ComplementarioAdapter complementario) {
        this.core = core;
        this.complementario = complementario;
    }

    public ClienteAgregadoResponse obtenerCliente(String clienteId) {
        var basicos = core.obtenerDatosBasicos(clienteId);
        var extendidos = complementario.obtenerDatosExtendidos(clienteId);

        return Mono.zip(basicos, extendidos)
                .map(tuple -> new ClienteAgregadoResponse(clienteId, tuple.getT1(), tuple.getT2()))
                .block();
    }
}
