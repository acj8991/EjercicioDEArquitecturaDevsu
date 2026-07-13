/** Contratos compartidos entre BFF Web, BFF Mobile, SPA y App Móvil. */

export interface ClienteBasico {
  id: string;
  nombre: string;
  documento: string;
  productos: string[];
}

export interface Movimiento {
  id: string;
  fecha: string;
  descripcion: string;
  monto: number;
  moneda: string;
  tipo: "DEBITO" | "CREDITO";
}

export interface TransferenciaDTO {
  cuentaOrigen: string;
  cuentaDestino: string;
  monto: number;
  moneda: string;
  interbancaria: boolean;
}

export interface SesionUsuario {
  clienteId: string;
  nombre: string;
  expiraEn: string;
}
