// src/components/PasswordRecoveryForm.jsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const PasswordRecoveryForm = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "http://localhost:5000/api/users/password-recovery",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        console.log("Solicitud exitosa:", data);
        console.log("Correo enviado a:", email);
        console.log(
          "Mensaje del backend:",
          data.message || "Sin mensaje del backend."
        );

        // Redirige después de los logs
        navigate("/password-recovery-success", { replace: true }); // Reemplaza la ruta actual en el historial
      } else {
        console.error("Error del servidor:", data.error);
        setError(
          data.error || "Error al solicitar la recuperación de contraseña."
        );
      }
    } catch (err) {
      console.error("Error en la solicitud:", err);
      setError("Error interno. Inténtalo más tarde.");
    }
  };

  return (
    <div className="common-page">
      <div className="form-container">
        <h2>Recuperación de Contraseña</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Correo Electrónico
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          {error && <p className="error">{error}</p>}
          <button type="submit">Enviar Código</button>
        </form>
      </div>
    </div>
  );
};

export default PasswordRecoveryForm;
