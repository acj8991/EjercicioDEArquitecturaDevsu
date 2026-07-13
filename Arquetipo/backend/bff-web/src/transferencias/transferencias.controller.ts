import { Body, Controller, Post } from "@nestjs/common";
import type { TransferenciaDTO } from "@bp/shared-dto";

@Controller("transferencias")
export class TransferenciasController {
  @Post()
  async ejecutar(@Body() dto: TransferenciaDTO) {
    // TODO: delegar a OrchestrationService.ejecutarTransferencia (fail-fast,
    // sin fallback -- ver PDF §4.8).
    return { estado: "PENDIENTE", detalle: dto };
  }
}
