import React, { createContext, useState, useContext, useEffect } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState("");
  const [passwordResetCompleted, setPasswordResetCompleted] = useState(false);

  // 🔄 Cargar usuario y token desde localStorage al iniciar la aplicación
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const savedToken = localStorage.getItem("token");

    console.log("🔍 Cargando datos desde localStorage...");
    console.log("📦 Usuario almacenado:", savedUser);
    console.log("🔑 Token almacenado:", savedToken);

    if (savedUser && savedToken) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        setToken(savedToken);
        console.log(
          "✅ Usuario y token cargados en `UserContext`:",
          parsedUser,
          savedToken
        );
      } catch (error) {
        console.error(
          "❌ Error al parsear usuario desde `localStorage`:",
          error
        );
      }
    } else {
      console.log("⚠️ No se encontraron usuario o token en `localStorage`.");
    }
  }, []);

  // ✅ Login con persistencia en localStorage
  const login = async (userData, userToken) => {
    console.log("🔐 Usuario recibido en login:", userData);

    setUser(userData);
    setToken(userToken);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", userToken);

    console.log("✅ Usuario guardado en localStorage correctamente.");
  };

  // 🔓 Logout: Elimina usuario y token
  const logout = () => {
    console.log("🚪 Cerrando sesión...");
    setUser(null);
    setToken("");
    setPasswordResetCompleted(false);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  // 📡 Fetch autenticado con el token desde localStorage
  const authenticatedFetch = async (url, options = {}) => {
    const storedToken = localStorage.getItem("token");
    const headers = {
      ...options.headers,
      Authorization: `Bearer ${token || storedToken}`,
      "Content-Type": "application/json",
    };

    console.log("🔄 Enviando solicitud con headers:", headers);

    const response = await fetch(url, { ...options, headers });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("❌ Error en la solicitud:", errorData);
      throw new Error(errorData.error || `Error: ${response.status}`);
    }

    return response.json();
  };

  // 🔄 Actualizar usuario en el contexto y localStorage
  const updateUser = (updatedUserData) => {
    setUser((prevUser) => {
      const newUser = { ...prevUser, ...updatedUserData };
      localStorage.setItem("user", JSON.stringify(newUser));
      return newUser;
    });
  };

  return (
    <UserContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        updateUser,
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
