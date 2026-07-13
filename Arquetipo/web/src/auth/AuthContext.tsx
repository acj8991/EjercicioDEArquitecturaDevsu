import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { httpClient } from "../api/httpClient";

interface AuthState {
  authenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthState>({ authenticated: false, loading: true });

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({ authenticated: false, loading: true });

  useEffect(() => {
    httpClient
      .get<{ authenticated: boolean }>("/auth/me")
      .then((r) => setState({ authenticated: r.authenticated, loading: false }))
      .catch(() => setState({ authenticated: false, loading: false }));
  }, []);

  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
