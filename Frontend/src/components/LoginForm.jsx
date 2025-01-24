// src/components/LoginForm.jsx

import React, { useState } from "react"; //hook que permite manejar el estado dentro del componente
import { useNavigate } from "react-router-dom"; // Hook para redirigir
import { useUserContext } from "../context/UserContext";

const LoginForm = () => {
  const { login } = useUserContext(); // Obtenemos la función login del contexto
  const [email, setEmail] = useState(""); // Estado para el correo electrónico
  const [password, setPassword] = useState(""); // Estado para la contraseña
  const navigate = useNavigate(); // Hook para redirigir

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Realizamos la solicitud al backend
      const response = await fetch("http://localhost:5000/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Guardamos el token en el contexto
        const loggedInUser = data.username || email; // Nombre de usuario recibido del backend o email usado
        login({ username: loggedInUser }, data.token);

        console.log("Token recibido:", data.token);
        console.log("Usuario logueado:", loggedInUser);

        alert("Inicio de sesión exitoso");
        // Redirige al usuario a la página principal después del login
        navigate("/"); // Cambia la ruta a "/"
      } else {
        // Manejamos errores del backend
        alert(data.error || "Error al iniciar sesión");
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
      alert("Ocurrió un error. Inténtalo de nuevo.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Correo Electrónico</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Contraseña</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <button type="submit">Iniciar Sesión</button>
    </form>
  );
};

export default LoginForm;
