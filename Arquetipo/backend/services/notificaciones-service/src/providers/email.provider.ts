import { Injectable } from "@nestjs/common";

/** Canal 2 de notificación (email). */
@Injectable()
export class EmailProvider {
  async enviar(clienteId: string, mensaje: string) {
    // TODO: integrar Amazon SES.
    return { canal: "email", clienteId, enviado: true };
  }
}
