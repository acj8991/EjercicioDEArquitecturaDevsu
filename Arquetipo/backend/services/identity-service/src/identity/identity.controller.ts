import { Body, Controller, Post } from "@nestjs/common";
import { WebauthnService } from "./webauthn.service";

/**
 * No implementa un IdP propio (el enunciado indica que BP ya tiene un
 * producto configurado con OAuth 2.0). Este servicio actúa como puente:
 * aprovisiona usuarios en el IdP tras el onboarding y gestiona el segundo
 * factor biométrico local (WebAuthn/FIDO2). Ver PDF §8.
 */
@Controller("identity")
export class IdentityController {
  constructor(private readonly webauthn: WebauthnService) {}

  @Post("provision")
  async provisionar(@Body() body: { clienteId: string; email: string }) {
    // TODO: llamar a la Admin API del IdP existente para crear el usuario.
    return { clienteId: body.clienteId, estado: "APROVISIONADO" };
  }

  @Post("webauthn/registro")
  async registrarBiometriaLocal(@Body() body: { clienteId: string }) {
    return this.webauthn.iniciarRegistro(body.clienteId);
  }
}
