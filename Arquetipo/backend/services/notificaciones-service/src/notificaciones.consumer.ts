import { Injectable } from "@nestjs/common";
import { PushSmsProvider } from "./providers/push-sms.provider";
import { EmailProvider } from "./providers/email.provider";
import type { DomainEvent } from "@bp/integration";

/**
 * Consume eventos de dominio (TransferenciaRealizada, ClienteOnboarded) y
 * despacha notificaciones por al menos dos canales -- ver PDF, requisito
 * normativo de notificación de movimientos.
 */
@Injectable()
export class NotificacionesConsumer {
  constructor(
    private readonly pushSms: PushSmsProvider,
    private readonly email: EmailProvider,
  ) {}

  async onEvent(evento: DomainEvent) {
    const mensaje = `Notificación: ${evento.type}`;
    await Promise.all([
      this.pushSms.enviar(evento.aggregateId, mensaje),
      this.email.enviar(evento.aggregateId, mensaje),
    ]);
  }
}
