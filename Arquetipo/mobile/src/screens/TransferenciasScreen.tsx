import { useState } from "react";
import { View, TextInput, Button, Text } from "react-native";
import { httpClient } from "../api/httpClient";

export function TransferenciasScreen() {
  const [cuentaDestino, setCuentaDestino] = useState("");
  const [monto, setMonto] = useState("");
  const [resultado, setResultado] = useState<string | null>(null);

  const transferir = async () => {
    try {
      await httpClient.post("/transferencias", {
        cuentaDestino,
        monto: Number(monto),
        moneda: "COP",
        interbancaria: false,
      });
      setResultado("Transferencia enviada.");
    } catch {
      setResultado("Error al transferir.");
    }
  };

  return (
    <View>
      <TextInput placeholder="Cuenta destino" value={cuentaDestino} onChangeText={setCuentaDestino} />
      <TextInput placeholder="Monto" value={monto} onChangeText={setMonto} keyboardType="numeric" />
      <Button title="Transferir" onPress={transferir} />
      {resultado && <Text>{resultado}</Text>}
    </View>
  );
}
