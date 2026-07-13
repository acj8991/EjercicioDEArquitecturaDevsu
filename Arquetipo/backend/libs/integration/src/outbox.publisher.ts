/**
 * Event Publisher -- patrón Transactional Outbox.
 * Ver PDF §9 -- Diseño de la solución de auditoría.
 *
 * En producción: el microservicio inserta la fila en la tabla `outbox` dentro
 * de la MISMA transacción de base de datos que el cambio de negocio; un
 * proceso de captura de cambios (CDC) publica luego el evento al bus
 * (EventBridge/MSK). Aquí se deja la interfaz y una implementación in-memory
 * para desarrollo local.
 */
export interface DomainEvent {
  type: string;
  aggregateId: string;
  payload: Record<string, unknown>;
  occurredAt: string;
}

export interface OutboxPublisher {
  publish(event: DomainEvent): Promise<void>;
}

export class LoggingOutboxPublisher implements OutboxPublisher {
  async publish(event: DomainEvent): Promise<void> {
    // TODO: reemplazar por escritura transaccional en tabla outbox +
    // publicación real a EventBridge/MSK.
    // eslint-disable-next-line no-console
    console.log("[outbox] evento publicado:", JSON.stringify(event));
  }
}
