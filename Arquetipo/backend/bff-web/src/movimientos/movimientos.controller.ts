import { Controller, Get, Param, Query } from "@nestjs/common";

@Controller("movimientos")
export class MovimientosController {
  @Get(":clienteId")
  async listar(
    @Param("clienteId") clienteId: string,
    @Query("limite") limite = 20,
  ) {
    // TODO: delegar a OrchestrationService / MovimientosAdapter con cache-aside.
    return { clienteId, limite, movimientos: [] };
  }
}
