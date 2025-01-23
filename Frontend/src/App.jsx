import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import MeetupForm from "./components/MeetupForm"; // Componente para crear/modificar meetups
import LoginForm from "./components/LoginForm"; // Componente para iniciar sesión
import UserValidationForm from "./components/UserValidationForm"; // Componente de validación de usuario
import ProtectedRoute from "./components/ProtectedRoute"; // Nuevo componente para proteger rutas
import "./App.css"; // Importa tus estilos si es necesario

const App = () => {
  const [meetups, setMeetups] = useState([]);

  const handleMeetupSubmit = (meetupData) => {
    setMeetups((prevMeetups) => [...prevMeetups, meetupData]);
    console.log("Meetup creado/actualizado:", meetupData);
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Ruta para iniciar sesión */}
          <Route path="/login" element={<LoginForm />} />

          {/* Ruta para validación de usuario */}
          <Route path="/validate-user" element={<UserValidationForm />} />

          {/* Ruta para meetups, protegida */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <>
                  <h1>Crear/Modificar Meetup</h1>
                  <MeetupForm onSubmit={handleMeetupSubmit} />
                  {meetups.map((meetup, index) => (
                    <div key={index}>
                      <h2>{meetup.title}</h2>
                      <p>{meetup.description}</p>
                      <p>{meetup.date}</p>
                    </div>
                  ))}
                </>
              </ProtectedRoute>
            }
          />

          {/* Captura cualquier ruta no definida y redirige al login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
