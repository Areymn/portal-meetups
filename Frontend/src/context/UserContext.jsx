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

  // Nuevo método para realizar solicitudes autenticadas al backend
  const authenticatedFetch = async (url, options = {}) => {
    try {
      const headers = {
        ...options.headers,
        Authorization: `Bearer ${token}`, // Añade el token al encabezado
        "Content-Type": "application/json",
      };
      const response = await fetch(url, { ...options, headers });

      // Si la respuesta no es "ok", manejar el error
      if (!response.ok) {
        const errorData = await response.json();
        console.error(
          `Error en la solicitud (${response.status}):`,
          errorData.error || errorData
        );
        throw new Error(
          errorData.error || `Error en la solicitud: ${response.status}`
        );
      }

      // Convertir la respuesta a JSON y devolverla
      const data = await response.json();
      console.log("Respuesta de la solicitud:", data); // Log de depuración
      return data;
    } catch (err) {
      // Log adicional en caso de error
      console.error("Error al realizar la solicitud autenticada:", err.message);
      throw err; // Re-lanzar el error para manejarlo en el componente
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        passwordResetCompleted,
        setPasswordResetCompleted,
        authenticatedFetch,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  return useContext(UserContext);
};
