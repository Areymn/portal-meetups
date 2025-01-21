import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import MeetupForm from "./components/MeetupForm"; // Componente para crear/modificar meetups
import LoginForm from "./components/LoginForm"; // Componente para iniciar sesión
import { useUserContext } from "./context/UserContext"; // Importando el contexto de usuario
import "./App.css"; // Importa tu archivo de estilos si es necesario

const App = () => {
  const { user } = useUserContext(); // Obtener el usuario del contexto
  const [meetups, setMeetups] = useState([]);

  const handleMeetupSubmit = (meetupData) => {
    setMeetups((prevMeetups) => [...prevMeetups, meetupData]);
    console.log("Meetup creado/actualizado:", meetupData);
  };

  return (
    <Router>
      <div className="App">
        <h1>{user ? "Crear/Modificar Meetup" : "Iniciar Sesión"}</h1>
        <Routes>
          {user ? (
            <Route
              path="/"
              element={
                <>
                  <MeetupForm onSubmit={handleMeetupSubmit} />
                  {meetups.map((meetup, index) => (
                    <div key={index}>
                      <h2>{meetup.title}</h2>
                      <p>{meetup.description}</p>
                      <p>{meetup.date}</p>
                    </div>
                  ))}
                </>
              }
            />
          ) : (
            <Route path="/" element={<LoginForm />} />
          )}
          {/* Redirige a la raíz si se intenta acceder a una ruta no definida */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
