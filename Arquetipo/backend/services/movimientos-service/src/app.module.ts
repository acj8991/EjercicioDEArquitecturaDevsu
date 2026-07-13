import { Module } from "@nestjs/common";
import { MovimientosController } from "./movimientos.controller";
import { MovimientosService } from "./movimientos.service";
import { CoreBancarioAdapter } from "./core-bancario.adapter";

@Module({
  controllers: [MovimientosController],
  providers: [MovimientosService, CoreBancarioAdapter],
})
export class AppModule {}
