import { useEffect, useState } from "react";
import { httpClient } from "../api/httpClient";

interface ResumenCliente {
  clienteId: string;
  datosBasicos?: unknown;
  ultimosMovimientos?: unknown;
}

export function DashboardPage() {
  const [resumen, setResumen] = useState<ResumenCliente | null>(null);

  useEffect(() => {
    // TODO: obtener clienteId real de la sesión (vía /auth/me extendido).
    httpClient.get<ResumenCliente>("/clientes/me/resumen").then(setResumen);
  }, []);

  return (
    <div>
      <h2>Resumen de cuenta</h2>
      <pre>{JSON.stringify(resumen, null, 2)}</pre>
    </div>
  );
}
