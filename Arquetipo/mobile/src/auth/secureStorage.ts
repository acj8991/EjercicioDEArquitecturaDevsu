import * as SecureStore from "expo-secure-store";

/**
 * Almacenamiento seguro de tokens en el dispositivo (Keychain en iOS,
 * Keystore/EncryptedSharedPreferences en Android vía expo-secure-store).
 * Ver PDF §5: los tokens nunca se guardan en almacenamiento plano.
 */
export const secureStorage = {
  async setTokens(accessToken: string, refreshToken: string) {
    await SecureStore.setItemAsync("bp_access_token", accessToken);
    await SecureStore.setItemAsync("bp_refresh_token", refreshToken);
  },
  async getAccessToken() {
    return SecureStore.getItemAsync("bp_access_token");
  },
  async getRefreshToken() {
    return SecureStore.getItemAsync("bp_refresh_token");
  },
  async clear() {
    await SecureStore.deleteItemAsync("bp_access_token");
    await SecureStore.deleteItemAsync("bp_refresh_token");
  },
};
