import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useUserContext } from "../context/UserContext";

const PasswordResetForm = () => {
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const { passwordResetCompleted, setPasswordResetCompleted } =
    useUserContext(); // Extrae el estado del contexto

  const [searchParams] = useSearchParams();
  const token = searchParams.get("token"); // Obtener el token desde la URL

  // Función para enviar el correo de notificación
  const sendPasswordResetNotification = async (email) => {
    if (!email) {
      console.error("No se proporcionó un email para la notificación.");
      setError("No se pudo enviar la notificación por correo.");
      return;
    }

    try {
      console.log("Enviando correo a:", email);
      const emailResponse = await fetch(
        "http://localhost:5000/api/users/password-reset-notification",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      const emailData = await emailResponse.json();

      if (emailResponse.ok) {
        console.log(
          "Correo de notificación enviado:",
          emailData.message || "Correo enviado exitosamente."
        );
      } else {
        console.error("Error al enviar el correo:", emailData.error);
      }
    } catch (err) {
      console.error("Error interno al enviar el correo:", err);
    }
  };

  // Función para manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "http://localhost:5000/api/users/reset-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token, newPassword }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        console.log("Contraseña restablecida con éxito.");

        // Enviar correo de notificación
        await sendPasswordResetNotification(email);

        setMessage("Contraseña restablecida con éxito.");
        setPasswordResetCompleted(true);
        setTimeout(() => {
          navigate("/password-reset-success");
        }, 1500);
      } else {
        console.error("Error del servidor:", data.error);
        setError(data.error || "Error al restablecer la contraseña.");
      }
    } catch (err) {
      console.error("Error interno:", err);
      setError("Error interno. Inténtalo más tarde.");
    }
  };

  // Decodificar el token para obtener el email (si aplica)
  useEffect(() => {
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1])); // Decodificar el payload del token
        if (payload.email) {
          setEmail(payload.email); // Establecer el email desde el token
        } else {
          console.error("El token no contiene un email válido.");
          setError("Token inválido o incompleto.");
        }
      } catch (err) {
        console.error("Error al decodificar el token:", err);
        setError("Token inválido o expirado.");
      }
    } else {
      console.error("No se proporcionó un token.");
      setError("No se pudo recuperar el token de restablecimiento.");
    }
  }, [token]);

  // Redirige a la página de éxito si ya completó el restablecimiento
  useEffect(() => {
    if (passwordResetCompleted) {
      navigate("/password-reset-success");
    }
  }, [passwordResetCompleted]);

  return (
    <div className="form-container">
      <h2>Cambio de Contraseña</h2>
      {message && <p className="success">{message}</p>} {/* Mensaje de éxito */}
      {error && <p className="error">{error}</p>} {/* Mensaje de error */}
      <form onSubmit={handleSubmit}>
        <label>
          Nueva Contraseña
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </label>
        <button type="submit">Cambiar Contraseña</button>
      </form>
    </div>
  );
};

export default PasswordResetForm;
