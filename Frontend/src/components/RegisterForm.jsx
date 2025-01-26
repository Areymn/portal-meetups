// src/components/RegisterForm.jsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    name: "",
    last_name: "",
  });

  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        alert(
          "Registro exitoso. Verifica tu correo electrónico para validar tu cuenta."
        );
        navigate(`/validate-user?email=${formData.email}`);
      } else {
        setError(data.error || "Error al registrarse.");
      }
    } catch (err) {
      console.error("Error en la solicitud:", err);
      setError("Error interno. Inténtalo más tarde.");
    }
  };

  return (
    <div className="form-container">
      <h2>Registro de Usuario</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Nombre de Usuario
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Correo Electrónico
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Contraseña
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Nombre
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Apellido
          <input
            type="text"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            required
          />
        </label>
        {error && <p className="error">{error}</p>}
        <button type="submit">Registrarse</button>
      </form>
    </div>
  );
};

export default RegisterForm;
