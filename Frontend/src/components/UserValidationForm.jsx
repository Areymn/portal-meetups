import React, { useState } from "react";
import "../UserValidationForm.css";
import { useUserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

const UserValidationForm = () => {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [message, setMessage] = useState(""); // Para mostrar mensajes al usuario
  const { token } = useUserContext(); // Obtener el token desde el contexto
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      // Realizamos la solicitud al backend
      const response = await fetch(
        "http://localhost:5000/api/users/validate-user-code",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Enviar el token como header
          },
          body: JSON.stringify({ email, code }), // Datos enviados al backend
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage("Usuario validado con éxito y cuenta activada");
        console.log("Validación exitosa:", data);
        // Redirige al login
        setTimeout(() => {
          navigate("/login");
        }, 1500);
      } else {
        setMessage(data.error || "Error al validar el código");
        console.error("Error recibido del backend:", data);
      }
    } catch (error) {
      setMessage("Hubo un problema al conectarse con el servidor.");
      console.error("Error en la solicitud:", error);
    }
  };

  return (
    <div className="common-page">
      <div>
        <form onSubmit={handleSubmit} className="user-validation-form">
          <div>
            <label htmlFor="email">Email:</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="code">Código de Validación:</label>
            <input
              id="code"
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
          </div>
          <button type="submit">Validar</button>
        </form>
        {message && <p>{message}</p>} {/* Mostramos el mensaje al usuario */}
      </div>
    </div>
  );
};

export default UserValidationForm;
