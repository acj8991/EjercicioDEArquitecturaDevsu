import axios from "axios";

export class MovimientosAdapter {
  constructor(private readonly baseUrl: string) {}

  async obtenerUltimos(clienteId: string, limite: number) {
    const { data } = await axios.get(
      `${this.baseUrl}/movimientos/${clienteId}`,
      { params: { limite } },
    );
    return data;
  }
}
