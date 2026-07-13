import { View, Text, Button } from "react-native";
import { loginConPKCE } from "../auth/pkce";
import { secureStorage } from "../auth/secureStorage";

export function LoginScreen({ onLoggedIn }: { onLoggedIn: () => void }) {
  const login = async () => {
    const { accessToken, refreshToken } = await loginConPKCE();
    await secureStorage.setTokens(accessToken, refreshToken);
    onLoggedIn();
  };

  return (
    <View>
      <Text>BP -- Banca por Internet</Text>
      <Button title="Ingresar (usuario/clave o biometría)" onPress={login} />
    </View>
  );
}
