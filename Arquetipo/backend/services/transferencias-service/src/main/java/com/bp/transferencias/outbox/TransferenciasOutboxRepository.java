package com.bp.transferencias.outbox;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Repository;

/**
 * Event Publisher -- patron Transactional Outbox (ver PDF, seccion "Diseno
 * de la solucion de auditoria"). En produccion: se inserta la fila en la
 * tabla `outbox` dentro de la MISMA transaccion de base de datos que el
 * movimiento; un proceso CDC publica luego el evento al bus (EventBridge/MSK).
 * Aqui se deja la interfaz y una implementacion de logging para desarrollo local.
 */
@Repository
public class TransferenciasOutboxRepository {

    private static final Logger log = LoggerFactory.getLogger(TransferenciasOutboxRepository.class);

    public void guardarYPublicar(DomainEvent event) {
        // TODO: INSERT transaccional en tabla `outbox` junto con el movimiento
        // de la transferencia en Aurora PostgreSQL (misma transaccion de BD).
        log.info("[outbox] evento publicado: {}", event);
    }
}
