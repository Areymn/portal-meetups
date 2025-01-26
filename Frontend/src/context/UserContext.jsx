// src/context/UserContext.jsx

import React, { createContext, useState, useContext, useEffect } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState("");
  const [passwordResetCompleted, setPasswordResetCompleted] = useState(false); // Nuevo estado

  // Leer el token y el usuario desde localStorage al iniciar la aplicación
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const savedToken = localStorage.getItem("token");
    console.log(
      "Cargando usuario y token desde localStorage:",
      savedUser,
      savedToken
    );
    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
      setToken(savedToken);
      console.log("Usuario cargado:", savedUser);
    } else {
      console.log("No se encontró usuario o token.");
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
    setPasswordResetCompleted(false); // Reinicia el estado de restablecimiento de contraseña

    // Eliminar los datos de localStorage
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <UserContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        passwordResetCompleted,
        setPasswordResetCompleted, // Exponemos el setter
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  return useContext(UserContext);
};
