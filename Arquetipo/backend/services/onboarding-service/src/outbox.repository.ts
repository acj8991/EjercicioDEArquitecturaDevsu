import { Injectable } from "@nestjs/common";
import { LoggingOutboxPublisher, DomainEvent } from "@bp/integration";

/** Ver patrón Transactional Outbox -- PDF §9. */
@Injectable()
export class OnboardingOutboxRepository {
  private readonly publisher = new LoggingOutboxPublisher();

  async guardarYPublicar(evento: DomainEvent) {
    // TODO: INSERT en tabla `outbox` dentro de la misma transacción que
    // el alta del cliente en la base transaccional (Aurora PostgreSQL).
    await this.publisher.publish(evento);
  }
}
