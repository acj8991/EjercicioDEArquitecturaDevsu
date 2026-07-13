import { Controller, Get, Param } from "@nestjs/common";

@Controller("clientes")
export class ClientesController {
  @Get(":id/resumen")
  async resumen(@Param("id") id: string) {
    return { clienteId: id, mensaje: "TODO: delegar a OrchestrationService" };
  }
}
