// src/components/LoginForm.jsx

import React, { useState } from "react"; //hook que permite manejar el estado dentro del componente
import { useNavigate } from "react-router-dom"; // Hook para redirigir
import { useUserContext } from "../context/UserContext";

const LoginForm = () => {
  const { login } = useUserContext(); // Obtenemos la función login del contexto
  const [username, setUsername] = useState(""); // Estado para el nombre de usuario
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
        body: JSON.stringify({ email: username, password }), // Nota: `username` usado como email
      });

      const data = await response.json();

      if (response.ok) {
        // Guardamos el token en el localStorage
        localStorage.setItem("token", data.token);
        console.log("Token recibido:", data.token);

        // Verifica si el backend envía el campo username
        const loggedInUser = data.username || username;

        // Guardamos el usuario y el token en el contexto
        login({ username: loggedInUser }, data.token);
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
        <label>Usuario</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
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
