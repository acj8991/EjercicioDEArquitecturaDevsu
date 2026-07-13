package com.bp.transferencias.adapter;

import com.bp.transferencias.dto.EjecutarTransferenciaRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.Map;

/** Adapter hacia la Red de Transferencias Interbancarias (ACH/Switch). */
@Component
public class InterbancariaAdapter {

    private final WebClient webClient;

    public InterbancariaAdapter(@Value("${red-interbancaria.base-url:}") String baseUrl) {
        this.webClient = WebClient.builder().baseUrl(baseUrl).build();
    }

    @SuppressWarnings("unchecked")
    public Mono<Map<String, Object>> originar(EjecutarTransferenciaRequest transferencia) {
        // TODO: construir mensaje ISO 20022 y firmarlo segun el estandar de la red.
        return webClient.post()
                .uri("/transferencias")
                .bodyValue(transferencia)
                .retrieve()
                .bodyToMono(Map.class);
    }
}
