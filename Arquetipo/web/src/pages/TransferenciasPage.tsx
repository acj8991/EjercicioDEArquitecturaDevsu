import { useState, FormEvent } from "react";
import { httpClient } from "../api/httpClient";

export function TransferenciasPage() {
  const [monto, setMonto] = useState("");
  const [cuentaDestino, setCuentaDestino] = useState("");
  const [resultado, setResultado] = useState<string | null>(null);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    // Sin fallback ante error: se muestra el fallo tal cual (fail-fast, PDF §4.8).
    try {
      await httpClient.post("/transferencias", {
        cuentaDestino,
        monto: Number(monto),
        moneda: "COP",
        interbancaria: false,
      });
      setResultado("Transferencia enviada.");
    } catch (err) {
      setResultado("Error al transferir. Intente nuevamente.");
    }
  };

  return (
    <div>
      <h2>Nueva transferencia</h2>
      <form onSubmit={onSubmit}>
        <input
          placeholder="Cuenta destino"
          value={cuentaDestino}
          onChange={(e) => setCuentaDestino(e.target.value)}
        />
        <input placeholder="Monto" value={monto} onChange={(e) => setMonto(e.target.value)} />
        <button type="submit">Transferir</button>
      </form>
      {resultado && <p>{resultado}</p>}
    </div>
  );
}
