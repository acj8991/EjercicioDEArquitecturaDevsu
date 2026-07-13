import { Injectable } from "@nestjs/common";
import { BiometriaAdapter } from "./biometria.adapter";
import { OnboardingOutboxRepository } from "./outbox.repository";

@Injectable()
export class OnboardingService {
  constructor(
    private readonly biometria: BiometriaAdapter,
    private readonly outbox: OnboardingOutboxRepository,
  ) {}

  async registrarCliente(input: {
    clienteId: string;
    selfieBase64: string;
    documentoBase64: string;
  }) {
    const verificacion = await this.biometria.verificar(
      input.selfieBase64,
      input.documentoBase64,
    );

    if (!verificacion.matchFacial || verificacion.livenessScore < 0.9) {
      return { estado: "RECHAZADO", verificacion };
    }

    await this.outbox.guardarYPublicar({
      type: "ClienteOnboarded",
      aggregateId: input.clienteId,
      payload: { verificacion },
      occurredAt: new Date().toISOString(),
    });

    // TODO: invocar identity-service /identity/provision para crear el
    // usuario en el IdP y luego /identity/webauthn/registro.
    return { estado: "APROBADO", verificacion };
  }
}
