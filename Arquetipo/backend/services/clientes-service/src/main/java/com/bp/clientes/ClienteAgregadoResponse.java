package com.bp.clientes;

import java.util.Map;

/**
 * DTO de respuesta: fusion de datos basicos (Core Bancario) + datos
 * extendidos (Sistema de Informacion Complementaria). Equivalente al
 * DTO compartido usado por los servicios en Node.js/NestJS -- ver
 * libs/shared-dto en el monorepo.
 */
public record ClienteAgregadoResponse(
        String clienteId,
        Map<String, Object> datosBasicos,
        Map<String, Object> datosExtendidos
) {}
