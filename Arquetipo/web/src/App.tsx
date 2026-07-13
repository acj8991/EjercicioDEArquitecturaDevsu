import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./auth/AuthContext";
import { Layout } from "./components/Layout";
import { LoginPage } from "./pages/LoginPage";
import { DashboardPage } from "./pages/DashboardPage";
import { MovimientosPage } from "./pages/MovimientosPage";
import { TransferenciasPage } from "./pages/TransferenciasPage";

function PrivateRoute({ children }: { children: JSX.Element }) {
  const { authenticated, loading } = useAuth();
  if (loading) return <p>Cargando...</p>;
  return authenticated ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
            <Route path="/movimientos" element={<PrivateRoute><MovimientosPage /></PrivateRoute>} />
            <Route path="/transferencias" element={<PrivateRoute><TransferenciasPage /></PrivateRoute>} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </AuthProvider>
  );
}
