import React from "react";
import { Navigate } from "react-router-dom";
import { useUserContext } from "../context/UserContext"; // Asegúrate de que la ruta al contexto sea correcta

const ProtectedRoute = ({ children }) => {
  const { user, token, loading } = useUserContext(); // Accede al usuario desde el contexto

  console.log("Verificando acceso a ruta protegida...");
  console.log("Usuario:", user);
  console.log("Token:", token);

  // Mostrar un mensaje de carga o componente de carga mientras se están verificando los datos
  if (loading) {
    console.log("Cargando datos del usuario...");
    return <div>Cargando...</div>; // Aquí podrías poner un spinner o algo similar
  }

  if (!user || !user.email || !token) {
    // Si no hay usuario autenticado, redirige al login
    console.log("🔴 Usuario no autenticado, redirigiendo a login...");
    return <Navigate to="/login" replace />;
  }

  console.log("Ruta protegida accedida. Usuario:", user);
  return children; // Si hay usuario, renderiza los hijos
};

export default ProtectedRoute;
