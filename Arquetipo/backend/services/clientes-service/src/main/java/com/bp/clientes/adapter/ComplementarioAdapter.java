package com.bp.clientes.adapter;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.Map;

/** Adapter hacia el Sistema de Informacion Complementaria (datos extendidos). */
@Component
public class ComplementarioAdapter {

    private final WebClient webClient;

    public ComplementarioAdapter(@Value("${complementario.base-url:}") String baseUrl) {
        this.webClient = WebClient.builder().baseUrl(baseUrl).build();
    }

    @SuppressWarnings("unchecked")
    public Mono<Map<String, Object>> obtenerDatosExtendidos(String clienteId) {
        return webClient.get()
                .uri("/clientes/{id}/detalle", clienteId)
                .retrieve()
                .bodyToMono(Map.class);
    }
}
