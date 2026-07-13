import { Injectable } from "@nestjs/common";

/**
 * Adapter hacia el proveedor externo de verificación biométrica (liveness +
 * match facial). Se recomienda "comprar" esta capacidad (p. ej. Amazon
 * Rekognition Face Liveness, Onfido, Incode) en lugar de construirla --
 * ver PDF §8, decisión build vs. buy.
 */
@Injectable()
export class BiometriaAdapter {
  async verificar(selfieBase64: string, documentoBase64: string) {
    // TODO: integrar SDK/API del proveedor elegido.
    return { livenessScore: 0.98, matchFacial: true };
  }
}
