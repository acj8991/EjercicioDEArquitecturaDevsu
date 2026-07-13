import { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { httpClient } from "../api/httpClient";

export function HomeScreen() {
  const [resumen, setResumen] = useState<unknown>(null);

  useEffect(() => {
    httpClient.get("/clientes/me/resumen").then((r) => setResumen(r.data));
  }, []);

  return (
    <View>
      <Text>Resumen de cuenta</Text>
      <Text>{JSON.stringify(resumen)}</Text>
    </View>
  );
}
