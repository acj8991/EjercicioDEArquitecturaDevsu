import { Module } from "@nestjs/common";
import { TokenHandlerController } from "./auth/token-handler.controller";
import { ClientesController } from "./clientes/clientes.controller";
import { MovimientosController } from "./movimientos/movimientos.controller";
import { TransferenciasController } from "./transferencias/transferencias.controller";

@Module({
  controllers: [
    TokenHandlerController,
    ClientesController,
    MovimientosController,
    TransferenciasController,
  ],
})
export class AppModule {}
