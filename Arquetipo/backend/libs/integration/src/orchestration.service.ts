import { CircuitBreaker } from "./circuit-breaker";
import { CacheClient } from "./cache.client";
import { ClientesAdapter } from "./adapters/clientes.adapter";
import { MovimientosAdapter } from "./adapters/movimientos.adapter";
import { TransferenciasAdapter, TransferenciaRequest } from "./adapters/transferencias.adapter";

/**
 * Orchestration Service -- componente central de la capa de integración
 * (Diagrama de Componentes, C4 Nivel 3). Orquesta, según el tipo de
 * transacción, las llamadas a los tres servicios iniciales (Clientes,
 * Movimientos, Transferencias), aplicando cache-aside y circuit breaker.
 */
export class OrchestrationService {
  private readonly breaker = new CircuitBreaker();

  constructor(
    private readonly clientes: ClientesAdapter,
    private readonly movimientos: MovimientosAdapter,
    private readonly transferencias: TransferenciasAdapter,
    private readonly cache: CacheClient,
  ) {}

  async obtenerResumenCliente(clienteId: string) {
    const cacheKey = `resumen:${clienteId}`;
    const cached = await this.cache.get(cacheKey);
    if (cached) return cached;

    const [datosBasicos, ultimosMovimientos] = await Promise.all([
      this.breaker.execute(() => this.clientes.obtenerDatosBasicos(clienteId)),
      this.breaker.execute(() => this.movimientos.obtenerUltimos(clienteId, 10)),
    ]);

    const resumen = { datosBasicos, ultimosMovimientos };
    await this.cache.set(cacheKey, resumen, 30);
    return resumen;
  }

  async ejecutarTransferencia(req: TransferenciaRequest) {
    // Las transferencias NO usan fallback: ante falla, se propaga el error
    // (fail-fast) en lugar de degradar silenciosamente. Ver PDF §4.8.
    const resultado = await this.breaker.execute(() =>
      this.transferencias.ejecutar(req),
    );
    await this.cache.invalidate(`resumen:${req.clienteId}`);
    return resultado;
  }
}
