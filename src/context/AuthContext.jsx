// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";

export const AuthContext = createContext();

const EXPIRY_DURATION = 1000 * 60 * 60; // 1 hour

export const AuthProvider = ({ children }) => {
  const token = localStorage.getItem("token");
  const loginTime = localStorage.getItem("loginTime");

  const isTokenValid = token && loginTime && (Date.now() - parseInt(loginTime) < EXPIRY_DURATION);
  const [isAuthenticated, setIsAuthenticated] = useState(isTokenValid);

  const login = () => {
    const now = Date.now();
    localStorage.setItem("token", "fake-token");
    localStorage.setItem("loginTime", now.toString());
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("loginTime");
    setIsAuthenticated(false);
  };

  useEffect(() => {
    if (isAuthenticated) {
      const timeout = setTimeout(() => {
        logout();
      }, EXPIRY_DURATION);
      return () => clearTimeout(timeout);
    }
  }, [isAuthenticated]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// ✅ This is the missing part!
export const useAuth = () => useContext(AuthContext);
