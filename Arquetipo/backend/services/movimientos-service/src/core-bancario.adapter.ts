import { Injectable } from "@nestjs/common";
import axios from "axios";

@Injectable()
export class CoreBancarioAdapter {
  private readonly baseUrl = process.env.CORE_BANCARIO_URL ?? "";

  async obtenerMovimientos(clienteId: string, limite: number) {
    const { data } = await axios.get(
      `${this.baseUrl}/movimientos/${clienteId}`,
      { params: { limite } },
    );
    return data;
  }
}
