import React from "react";
import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(
    sessionStorage.getItem("isLoggedIn") === "true"
  ); //useState da bi rerenderovali

  const login = (user) => {
    sessionStorage.setItem("isLoggedIn", "true");
    sessionStorage.setItem("user", JSON.stringify(user));
    setIsLoggedIn(true);
  }; //cuvamo usera u sessionStorage

  const logout = () => {
    sessionStorage.removeItem("isLoggedIn");
    sessionStorage.removeItem("user");
    setIsLoggedIn(false);
  }; //uklanjamo ga sessionStorage

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
