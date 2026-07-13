import { Body, Controller, Post } from "@nestjs/common";
import type { TransferenciaDTO } from "@bp/shared-dto";

@Controller("transferencias")
export class TransferenciasController {
  @Post()
  async ejecutar(@Body() dto: TransferenciaDTO) {
    return { estado: "PENDIENTE", detalle: dto };
  }
}
