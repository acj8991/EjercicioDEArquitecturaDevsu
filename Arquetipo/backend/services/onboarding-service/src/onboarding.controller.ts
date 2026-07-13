import { Body, Controller, Post } from "@nestjs/common";
import { OnboardingService } from "./onboarding.service";

@Controller("onboarding")
export class OnboardingController {
  constructor(private readonly service: OnboardingService) {}

  @Post()
  async registrar(
    @Body() body: { clienteId: string; selfieBase64: string; documentoBase64: string },
  ) {
    return this.service.registrarCliente(body);
  }
}
