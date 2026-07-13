import { Controller, Get, Param } from "@nestjs/common";

/**
 * Expone al canal web el resumen de cliente, orquestado por el
 * Orchestration Service de @bp/integration (Diagrama de Componentes).
 */
@Controller("clientes")
export class ClientesController {
  @Get(":id/resumen")
  async resumen(@Param("id") id: string) {
    // TODO: inyectar OrchestrationService (ver backend/libs/integration)
    return { clienteId: id, mensaje: "TODO: delegar a OrchestrationService" };
  }
}
