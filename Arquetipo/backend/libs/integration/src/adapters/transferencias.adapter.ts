import axios from "axios";

export interface TransferenciaRequest {
  clienteId: string;
  cuentaOrigen: string;
  cuentaDestino: string;
  monto: number;
  moneda: string;
  interbancaria: boolean;
}

export class TransferenciasAdapter {
  constructor(private readonly baseUrl: string) {}

  async ejecutar(req: TransferenciaRequest) {
    const { data } = await axios.post(`${this.baseUrl}/transferencias`, req);
    return data;
  }
}
