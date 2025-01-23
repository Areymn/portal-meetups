// src/context/UserContext.jsx

import React, { createContext, useState, useContext, useEffect } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState("");

  // Leer el token y el usuario desde localStorage al iniciar la aplicación
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const savedToken = localStorage.getItem("token");
    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
      setToken(savedToken);
    }
  }, []);

  const login = (userData, userToken) => {
    // Guardar el usuario y el token en el estado
    setUser(userData);
    setToken(userToken);
    // Guardar los datos en localStorage
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", userToken);
    console.log("Usuario guardado en localStorage:", userData);
    console.log("Token guardado en localStorage:", userToken);
  };

  const logout = () => {
    // Limpiar el estado
    setUser(null);
    setToken("");

    // Eliminar los datos de localStorage
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <UserContext.Provider value={{ user, token, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  return useContext(UserContext);
};
