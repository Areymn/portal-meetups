import React, { createContext, useState, useContext, useEffect } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState("");
  const [passwordResetCompleted, setPasswordResetCompleted] = useState(false);
  const [loading, setLoading] = useState(true);

  // Cargar usuario y token desde localStorage al iniciar la aplicación
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
          "✅ Usuario y token cargados en UserContext:",
          parsedUser,
          savedToken
        );
      } catch (error) {
        console.error("❌ Error al parsear usuario desde localStorage:", error);
      }
    } else {
      console.log("⚠️ No se encontraron usuario o token en localStorage.");
    }
    setLoading(false);
  }, []);

  // Función para recuperar datos actualizados del usuario
  const fetchUserData = async () => {
    try {
      console.log("📡 Solicitando datos del usuario...");
      const tokenLocal = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/users/me", {
        headers: {
          Authorization: `Bearer ${tokenLocal}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        alert(
          "⚠️ No se pudo obtener la sesión. Revisa tu conexión o inicia sesión de nuevo."
        );
        return;
      }

      const data = await response.json();
      setUser(data);
      console.log("✅ Usuario obtenido correctamente:", data);
    } catch (error) {
      console.error("❌ Error al recuperar usuario:", error);
    }
  };

  // Función login con persistencia en localStorage
  const login = async (userData, userToken) => {
    console.log("🔐 Usuario recibido en login:", userData);
    setUser(userData);
    setToken(userToken);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", userToken);
    console.log("✅ Usuario guardado en localStorage correctamente.");
    fetchUserData();
  };

  // Función logout: elimina usuario y token
  const logout = () => {
    console.log("🚪 Cerrando sesión...");
    setUser(null);
    setToken("");
    setPasswordResetCompleted(false);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  // Función authenticatedFetch que envía solicitudes autenticadas
  const authenticatedFetch = async (url, options = {}) => {
    const storedToken = localStorage.getItem("token");
    const finalToken = token || storedToken;
    console.log("🔍 Token obtenido para authenticatedFetch:", finalToken);

    if (!finalToken) {
      console.error("❌ ERROR: No hay token disponible para la solicitud.");
      throw new Error("No hay token de autenticación.");
    }

    // Definir headers de forma correcta
    const headers = {
      ...options.headers,
      Authorization: `Bearer ${finalToken}`,
    };

    if (options.body && !(options.body instanceof FormData)) {
      headers["Content-Type"] = "application/json";
    }

    console.log("📡 Enviando solicitud a:", url);
    console.log("📜 Headers enviados:", headers);

    const response = await fetch(url, { ...options, headers });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("❌ Error en la solicitud:", errorData);
      throw new Error(errorData.error || `Error: ${response.status}`);
    }

    return response.json();
  };

  // Función para actualizar el usuario en el contexto y localStorage
  const updateUser = (updatedUserData) => {
    setUser((prevUser) => {
      const newUser = {
        ...prevUser,
        avatar: updatedUserData.avatar || "/default-avatar.png",
      };
      localStorage.setItem("user", JSON.stringify(newUser));
      return newUser;
    });
  };

  return (
    <UserContext.Provider
      value={{
        user,
        token,
        setToken,
        setUser,
        login,
        logout,
        updateUser,
        passwordResetCompleted,
        setPasswordResetCompleted,
        authenticatedFetch,
        fetchUserData,
        loading,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  return useContext(UserContext);
};

export default UserContext;
