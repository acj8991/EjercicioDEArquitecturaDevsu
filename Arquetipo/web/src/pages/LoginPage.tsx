/** Redirige al flujo del BFF (Authorization Code + PKCE lo maneja el BFF). */
export function LoginPage() {
  const login = () => {
    window.location.href = "/auth/login";
  };
  return (
    <div>
      <h2>Iniciar sesión</h2>
      <button onClick={login}>Ingresar con mi cuenta BP</button>
    </div>
  );
}
