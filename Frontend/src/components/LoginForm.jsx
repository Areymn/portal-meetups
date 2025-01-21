// src/components/LoginForm.jsx

import React, { useState } from 'react';//hook que permite manejar el estado dentro del componente
import { useUserContext } from '../context/UserContext';

const LoginForm = () => {
  const { login } = useUserContext();// Obtenemos la función login del contexto
  const [username, setUsername] = useState('');// Estado para el nombre de usuario
  const [password, setPassword] = useState('');// Estado para la contraseña

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const userData = { username }; // Datos del usuario
    const userToken = 'tokenDeEjemplo123'; // token de usuario (simulado)
    
    // Guardamos el usuario y el token en el contexto
    login(userData, userToken);
    console.log('Usuario logueado:', userData);
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
