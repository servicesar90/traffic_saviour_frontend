
import { Navigate } from "react-router-dom";

export function RoutesProtector({ children }) {
  const user = safeUser();

  if (!user) {
    
    localStorage.removeItem("token");
    localStorage.removeItem("user"); 
    return <Navigate to="/signin" replace />;
  }

  return children;
}

export function LoginProtector({ children }) {
  const user = safeUser();
  return user ? <Navigate to="/Dashboard/allStats" replace /> : children;
}


function safeUser() {
  try {
    const stored = localStorage.getItem("user");
    if (!stored || stored === "undefined" || stored === "null") return null;
    return JSON.parse(stored);
  } catch {
    return null;
  }
}
