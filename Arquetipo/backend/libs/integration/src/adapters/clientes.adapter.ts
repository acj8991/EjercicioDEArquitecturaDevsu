import axios from "axios";

/**
 * Adapter hacia el microservicio de Clientes (que a su vez agrega Core
 * Bancario + Sistema Complementario mediante su propio patrón Adapter/ACL).
 */
export class ClientesAdapter {
  constructor(private readonly baseUrl: string) {}

  async obtenerDatosBasicos(clienteId: string) {
    const { data } = await axios.get(`${this.baseUrl}/clientes/${clienteId}`);
    return data;
  }
}
