import React, { createContext, useContext, useMemo, useState, useEffect } from "react";
import { setAuthToken } from "../api/client";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Load token from localStorage (so user stays logged in after refresh)
  const [token, setToken] = useState(localStorage.getItem("token"));

  // Whenever token changes, update axios headers globally
  useEffect(() => {
    setAuthToken(token);
  }, [token]);

  // Save token and attach to axios
  const login = (t) => {
    setToken(t);
    localStorage.setItem("token", t);
    setAuthToken(t);
  };

  // Remove token and clear axios header
  const logout = () => {
    setToken(null);
    localStorage.removeItem("token");
    setAuthToken(null);
  };

  const value = useMemo(
    () => ({
      token,
      login,
      logout,
      isAuthenticated: !!token,
    }),
    [token]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook for easier access to auth state
export const useAuth = () => useContext(AuthContext);
