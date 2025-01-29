import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useUserContext } from "../context/UserContext";

const LoginForm = () => {
  const { login } = useUserContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        login(data.user, data.token);
        navigate("/"); // ✅ Redirige a EventList después de iniciar sesión
      } else {
        alert(data.error || "Error al iniciar sesión");
      }
    } catch (error) {
      alert("Ocurrió un error. Inténtalo de nuevo.");
    }
  };

  return (
    <div className="login-container">
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Correo Electrónico</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Contraseña</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {/* ✅ Agregado enlace para recuperar contraseña */}
        <div>
          <Link
            to="/password-recovery"
            style={{
              display: "block",
              marginBottom: "10px",
              color: "#007bff",
              textDecoration: "none",
            }}
          >
            ¿Olvidaste tu contraseña?
          </Link>
        </div>
        <button type="submit">Iniciar Sesión</button>
      </form>
      {/* ✅ Enlace para registrarse debajo del formulario */}
      <p style={{ marginTop: "10px" }}>
        ¿No tienes cuenta?{" "}
        <Link to="/register" style={{ color: "#007bff" }}>
          Regístrate aquí
        </Link>
      </p>
    </div>
  );
};

export default LoginForm;
