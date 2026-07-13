package com.bp.transferencias.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record EjecutarTransferenciaRequest(
        @NotBlank String clienteId,
        @NotBlank String cuentaOrigen,
        @NotBlank String cuentaDestino,
        @NotNull @DecimalMin(value = "0.01", message = "Monto invalido") Double monto,
        @NotBlank String moneda,
        boolean interbancaria
) {}
