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

  // ✅ Nueva función para recuperar datos actualizados del usuario
  const fetchUserData = async () => {
    try {
      console.log("📡 Solicitando datos del usuario...");

      const storedToken = localStorage.getItem("token");
      if (!storedToken) {
        throw new Error("No hay token en localStorage.");
      }

      const headers = {
        // 🔥 Posible corrección
        Authorization: `Bearer ${storedToken}`,
        "Content-Type": "application/json",
      };

      const response = await fetch("http://localhost:5000/api/users/me", {
        headers,
      });

      console.log("🔄 Respuesta del servidor en `fetchUserData`:", response);

      // if (!response.ok) {
      //   throw new Error(`Error: ${response.status}`);
      // }

      if (!response.ok) {
        throw new Error("Error al obtener datos del usuario");
      }

      const data = await response.json();
      setUser(data);
      console.log("✅ Datos de usuario cargados correctamente:", data);
    } catch (error) {
      console.error("❌ Error al recuperar usuario:", error);
    }
  };

  // ✅ Login con persistencia en localStorage
  const login = async (userData, userToken) => {
    console.log("🔐 Usuario recibido en login:", userData);

    setUser(userData);
    setToken(userToken);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", userToken);

    console.log("✅ Usuario guardado en localStorage correctamente.");

    // 🔄 Al iniciar sesión, obtener datos actualizados
    fetchUserData();
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
    const finalToken = token || storedToken;

    console.log("🔍 Token obtenido para authenticatedFetch:", finalToken);

    if (!finalToken) {
      console.error("❌ ERROR: No hay token disponible para la solicitud.");
      throw new Error("No hay token de autenticación.");
    }

    const headers = {
      ...options.headers,
      Authorization: `Bearer ${finalToken}`,
    };

    // ❗ Si el body es JSON, asegurar que el Content-Type esté correctamente definido
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

  // 🔄 Actualizar usuario en el contexto y localStorage
  const updateUser = (updatedUserData) => {
    setUser((prevUser) => {
      const newUser = {
        ...prevUser,
        avatar: updatedUserData.avatar || "/default-avatar.png", // Si no tiene avatar, usa el por defecto
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
        fetchUserData, // 🔄 Se expone para poder usarse en otros componentes
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  return useContext(UserContext);
};
