import { Module } from "@nestjs/common";
import { ClientesController } from "./clientes/clientes.controller";
import { MovimientosController } from "./movimientos/movimientos.controller";
import { TransferenciasController } from "./transferencias/transferencias.controller";

@Module({
  controllers: [ClientesController, MovimientosController, TransferenciasController],
})
export class AppModule {}
