import { Injectable } from "@nestjs/common";

/**
 * Registro de biometría local (Face ID / Touch ID / huella) vía WebAuthn/
 * FIDO2, usando el enclave seguro del dispositivo. El backend nunca recibe
 * ni almacena datos biométricos crudos, solo la clave pública y el
 * "attestation" -- ver PDF §8, justificación 2.
 */
@Injectable()
export class WebauthnService {
  async iniciarRegistro(clienteId: string) {
    // TODO: usar @simplewebauthn/server -> generateRegistrationOptions(...)
    return { clienteId, challenge: "TODO-challenge-webauthn" };
  }

  async verificarRegistro(clienteId: string, respuesta: unknown) {
    // TODO: verifyRegistrationResponse(...)
    return { clienteId, verificado: true, respuesta };
  }
}
