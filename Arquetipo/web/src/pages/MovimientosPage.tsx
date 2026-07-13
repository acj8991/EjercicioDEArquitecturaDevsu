import { useEffect, useState } from "react";
import { httpClient } from "../api/httpClient";

export function MovimientosPage() {
  const [movimientos, setMovimientos] = useState<unknown[]>([]);

  useEffect(() => {
    httpClient
      .get<{ movimientos: unknown[] }>("/movimientos/me?limite=20")
      .then((r) => setMovimientos(r.movimientos));
  }, []);

  return (
    <div>
      <h2>Movimientos</h2>
      <ul>
        {movimientos.map((m, i) => (
          <li key={i}>{JSON.stringify(m)}</li>
        ))}
      </ul>
    </div>
  );
}
