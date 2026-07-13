import { useState } from "react";
import { LoginScreen } from "./src/screens/LoginScreen";
import { HomeScreen } from "./src/screens/HomeScreen";

/** Navegación simplificada (en un proyecto real: React Navigation). */
export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  return loggedIn ? <HomeScreen /> : <LoginScreen onLoggedIn={() => setLoggedIn(true)} />;
}
