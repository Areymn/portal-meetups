import React from "react";
import { Navigate } from "react-router-dom";
import { useUserContext } from "../context/UserContext"; // Asegúrate de que la ruta al contexto sea correcta

const ProtectedRoute = ({ children }) => {
  const { user, token } = useUserContext(); // Accede al usuario desde el contexto

  console.log("Verificando acceso a ruta protegida...");
  console.log("Usuario:", user);
  console.log("Token:", token);

  if (!user || !user.email || !token) {
    // Si no hay usuario autenticado, redirige al login
    console.log("Acceso denegado, redirigiendo al login...");
    return <Navigate to="/login" replace />;
  }

  console.log("Ruta protegida accedida. Usuario:", user);
  return children; // Si hay usuario, renderiza los hijos
};

export default ProtectedRoute;
