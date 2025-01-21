import React, { useState } from 'react';
import MeetupForm from './components/MeetupForm'; // Componente para crear/modificar meetups
import LoginForm from './components/LoginForm'; // Componente para iniciar sesión
import { useUserContext } from './context/UserContext'; // Importando el contexto de usuario
import './App.css'; // Importa tu archivo de estilos si es necesario

const App = () => {
  const { user } = useUserContext(); // Obtener el usuario del contexto
  const [meetups, setMeetups] = useState([]); 

  const handleMeetupSubmit = (meetupData) => {
    setMeetups((prevMeetups) => [...prevMeetups, meetupData]);
    console.log('Meetup creado/actualizado:', meetupData);
  };

  return (
    <div className="App">
      <h1>{user ? 'Crear/Modificar Meetup' : 'Iniciar Sesión'}</h1>
      {user ? (
        // Mostrar el formulario de meetups si el usuario está autenticado
        <>
          <MeetupForm onSubmit={handleMeetupSubmit} />
          <div>
            {meetups.map((meetup, index) => (
              <div key={index}>
                <h2>{meetup.title}</h2>
                <p>{meetup.description}</p>
                <p>{meetup.date}</p>
              </div>
            ))}
          </div>
        </>
      ) : (
        // Mostrar el formulario de inicio de sesión si el usuario no está autenticado
        <LoginForm />
      )}
    </div>
  );
};

export default App;

