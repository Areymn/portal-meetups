import React from "react";
import { useNavigate } from "react-router-dom";

const PasswordResetSuccess = () => {
  const navigate = useNavigate();

  const handleLoginRedirect = () => {
    navigate("/login"); // Redirige al login
  };

  return (
    <div className="common-page">
      <div className="form-container">
        <h2>¡Contraseña Restablecida!</h2>
        <p>Tu contraseña ha sido restablecida exitosamente.</p>
        <button onClick={handleLoginRedirect}>Iniciar Sesión</button>
      </div>
    </div>
  );
};

export default PasswordResetSuccess;
