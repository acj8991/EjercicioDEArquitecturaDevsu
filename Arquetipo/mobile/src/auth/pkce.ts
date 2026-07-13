import * as Crypto from "expo-crypto";
import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";

WebBrowser.maybeCompleteAuthSession();

/**
 * Authorization Code + PKCE (RFC 7636 + RFC 8252) -- flujo recomendado para
 * apps nativas. Ver PDF §7. Usa AuthSession (Custom Tabs / ASWebAuthenticationSession),
 * nunca un WebView embebido, para no exponer credenciales a la app.
 */
const discovery = {
  authorizationEndpoint: process.env.EXPO_PUBLIC_IDP_AUTHORIZE_URL ?? "",
  tokenEndpoint: process.env.EXPO_PUBLIC_IDP_TOKEN_URL ?? "",
};

export async function loginConPKCE() {
  const redirectUri = AuthSession.makeRedirectUri({ scheme: "bpbanca" });

  const request = new AuthSession.AuthRequest({
    clientId: process.env.EXPO_PUBLIC_IDP_CLIENT_ID ?? "",
    redirectUri,
    responseType: AuthSession.ResponseType.Code,
    usePKCE: true, // genera code_verifier/code_challenge automáticamente
    scopes: ["openid", "profile", "transacciones"],
  });

  const result = await request.promptAsync(discovery);
  if (result.type !== "success") {
    throw new Error("Login cancelado o fallido");
  }

  // Intercambio del code + code_verifier por tokens.
  const tokenResult = await AuthSession.exchangeCodeAsync(
    {
      clientId: process.env.EXPO_PUBLIC_IDP_CLIENT_ID ?? "",
      code: result.params.code,
      redirectUri,
      extraParams: { code_verifier: request.codeVerifier ?? "" },
    },
    discovery,
  );

  return {
    accessToken: tokenResult.accessToken,
    refreshToken: tokenResult.refreshToken ?? "",
  };
}

export async function generarChallengeManual(verifier: string) {
  // Referencia: cómo se derivaría el code_challenge si no se usa AuthSession.
  return Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, verifier, {
    encoding: Crypto.CryptoEncoding.BASE64,
  });
}
