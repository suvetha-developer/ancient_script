import { useState } from "react";
import { Dashboard } from "./components/Dashboard";
import { Login } from "./components/Login";

export default function App() {
  const [userEmail, setUserEmail] = useState<string | null>(() =>
    localStorage.getItem("tamil_inscription_user") || "swethac164@heritage.ai",
  );

  const handleLogin = (email: string) => {
    localStorage.setItem("tamil_inscription_user", email);
    setUserEmail(email);
  };

  const handleLogout = () => {
    localStorage.removeItem("tamil_inscription_user");
    setUserEmail(null);
  };

  if (!userEmail) {
    return <Login onLogin={handleLogin} />;
  }

  return <Dashboard userEmail={userEmail} onLogout={handleLogout} />;
}
