package com.bp.clientes.adapter;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.Map;

/**
 * Adapter / Anti-Corruption Layer hacia el Core Bancario (sistema externo,
 * fuente de verdad de datos basicos, productos y movimientos). Traduce el
 * modelo externo del Core al modelo de dominio interno -- ver PDF, seccion
 * "Arquitectura de acceso a datos".
 */
@Component
public class CoreBancarioAdapter {

    private final WebClient webClient;

    public CoreBancarioAdapter(@Value("${core-bancario.base-url:}") String baseUrl) {
        this.webClient = WebClient.builder().baseUrl(baseUrl).build();
    }

    @SuppressWarnings("unchecked")
    public Mono<Map<String, Object>> obtenerDatosBasicos(String clienteId) {
        // TODO: mapear el contrato real del Core Bancario a nuestro DTO interno.
        return webClient.get()
                .uri("/clientes/{id}", clienteId)
                .retrieve()
                .bodyToMono(Map.class);
    }
}
