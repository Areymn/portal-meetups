import React from "react";
import { Navigate } from "react-router-dom";
import { useUserContext } from "../context/UserContext"; // Asegúrate de que la ruta al contexto sea correcta

const ProtectedRoute = ({ children }) => {
  const { user } = useUserContext(); // Accede al usuario desde el contexto
  console.log("Ruta protegida accedida. Usuario:", user);

  if (!user) {
    // Si no hay usuario autenticado, redirige al login
    console.log("Redirigiendo al login porque el usuario no está autenticado.");
    return <Navigate to="/login" replace />;
  }

  return children; // Si hay usuario, renderiza los hijos
};

export default ProtectedRoute;
