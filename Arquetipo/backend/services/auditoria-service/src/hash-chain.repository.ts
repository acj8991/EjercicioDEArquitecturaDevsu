import { Injectable } from "@nestjs/common";
import { createHash } from "crypto";
import type { DomainEvent } from "@bp/integration";

/**
 * Almacén de auditoría append-only con encadenamiento de hashes
 * (tamper-evident log) sobre Aurora PostgreSQL. Se descarta Amazon QLDB
 * porque AWS discontinuó el servicio (fin de soporte 31-jul-2025) --
 * ver PDF §9, nota de decisión relevante.
 */
@Injectable()
export class HashChainRepository {
  private ultimoHash = "GENESIS";

  async agregar(evento: DomainEvent) {
    const contenido = JSON.stringify(evento) + this.ultimoHash;
    const hash = createHash("sha256").update(contenido).digest("hex");

    // TODO: INSERT en tabla append-only real (Aurora PostgreSQL):
    // (id, evento_json, hash_anterior, hash_actual, creado_en)
    this.ultimoHash = hash;
    return { hash, evento };
  }

  async verificarIntegridad(): Promise<boolean> {
    // TODO: recorrer la tabla y recalcular la cadena de hashes para
    // detectar alteraciones retroactivas.
    return true;
  }
}
