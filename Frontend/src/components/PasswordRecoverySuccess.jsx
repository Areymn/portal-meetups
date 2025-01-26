import React from "react";
import { Link } from "react-router-dom";

const PasswordRecoverySuccess = () => {
  return (
    <div className="form-container">
      <h2>¡Correo Enviado!</h2>
      <p>
        Se ha enviado un correo a la dirección indicada con las instrucciones
        para recuperar tu contraseña. Por favor, revisa tu bandeja de entrada y
        sigue las instrucciones.
      </p>
      <Link to="/login">
        <button>Volver al Inicio de Sesión</button>
      </Link>
    </div>
  );
};

export default PasswordRecoverySuccess;
