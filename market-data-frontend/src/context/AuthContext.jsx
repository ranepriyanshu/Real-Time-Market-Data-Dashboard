import React, { createContext, useContext, useMemo, useState, useEffect } from "react";
import { setAuthToken } from "../api/client";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  
  const [token, setToken] = useState(localStorage.getItem("token"));

 
  useEffect(() => {
    setAuthToken(token);
  }, [token]);

  
  const login = (t) => {
    setToken(t);
    localStorage.setItem("token", t);
    setAuthToken(t);
  };

  
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


export const useAuth = () => useContext(AuthContext);
