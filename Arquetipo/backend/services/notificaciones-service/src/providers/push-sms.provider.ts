import { Injectable } from "@nestjs/common";

/** Canal 1 de notificación (push/SMS) -- requisito normativo de mínimo 2 canales. */
@Injectable()
export class PushSmsProvider {
  async enviar(clienteId: string, mensaje: string) {
    // TODO: integrar Amazon SNS / Firebase Cloud Messaging.
    return { canal: "push_sms", clienteId, enviado: true };
  }
}
