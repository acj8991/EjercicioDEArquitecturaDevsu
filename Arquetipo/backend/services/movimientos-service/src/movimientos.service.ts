import { Injectable } from "@nestjs/common";
import { CoreBancarioAdapter } from "./core-bancario.adapter";

@Injectable()
export class MovimientosService {
  constructor(private readonly core: CoreBancarioAdapter) {}

  async listar(clienteId: string, limite: number) {
    // Lectura de solo consulta -- candidata a cache-aside en el BFF
    // (ver @bp/integration CacheClient). Ver PDF §10.
    return this.core.obtenerMovimientos(clienteId, limite);
  }
}
