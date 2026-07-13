/**
 * Cliente HTTP de la SPA hacia el BFF Web. `credentials: "include"` es
 * clave: la sesión viaja en una cookie httpOnly que el navegador nunca
 * puede leer (patrón Token Handler / BFF de seguridad -- ver PDF §7).
 * La SPA NUNCA maneja el Access Token directamente.
 */
const BASE_URL = import.meta.env.VITE_BFF_URL ?? "";

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    credentials: "include",
    headers: { "Content-Type": "application/json", ...options.headers },
  });
  if (res.status === 401) {
    window.location.href = "/auth/login";
    throw new Error("No autenticado");
  }
  if (!res.ok) throw new Error(`Error HTTP ${res.status}`);
  return res.json();
}

export const httpClient = {
  get: <T,>(path: string) => request<T>(path),
  post: <T,>(path: string, body: unknown) =>
    request<T>(path, { method: "POST", body: JSON.stringify(body) }),
};
