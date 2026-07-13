import { useState } from "react";
import { View, Text, Button } from "react-native";
import { httpClient } from "../api/httpClient";

/**
 * Onboarding con reconocimiento facial -- ver PDF §8. Aquí solo se deja el
 * flujo de orquestación; la captura de cámara y el SDK de liveness del
 * proveedor elegido (p. ej. Rekognition Face Liveness / Onfido) se integran
 * en el paso "TODO".
 */
export function OnboardingScreen() {
  const [estado, setEstado] = useState<string | null>(null);

  const iniciarOnboarding = async () => {
    // TODO: capturar selfie + documento con el SDK del proveedor biométrico.
    const selfieBase64 = "TODO";
    const documentoBase64 = "TODO";

    const { data } = await httpClient.post("/onboarding", {
      clienteId: "TODO-cliente-id",
      selfieBase64,
      documentoBase64,
    });
    setEstado(data.estado);
  };

  return (
    <View>
      <Text>Onboarding -- verificación de identidad</Text>
      <Button title="Iniciar verificación biométrica" onPress={iniciarOnboarding} />
      {estado && <Text>Estado: {estado}</Text>}
    </View>
  );
}
