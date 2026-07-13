import { Controller, Get, Param, Query } from "@nestjs/common";
import { MovimientosService } from "./movimientos.service";

@Controller("movimientos")
export class MovimientosController {
  constructor(private readonly service: MovimientosService) {}

  @Get(":clienteId")
  async listar(@Param("clienteId") clienteId: string, @Query("limite") limite = 20) {
    return this.service.listar(clienteId, Number(limite));
  }
}
