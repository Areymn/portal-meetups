import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
} from "react-router-dom";
import "./styles/global.css";
import { UserProvider, useUserContext } from "./context/UserContext";
import MeetupForm from "./components/MeetupForm";
import MeetupPage from "./components/MeetupPage";
import RegisterForm from "./components/RegisterForm";
import LoginForm from "./components/LoginForm";
import UserValidationForm from "./components/UserValidationForm";
import ProtectedRoute from "./components/ProtectedRoute";
import PasswordRecoveryForm from "./components/PasswordRecoveryForm";
import PasswordRecoverySuccess from "./components/PasswordRecoverySuccess";
import PasswordResetForm from "./components/PasswordResetForm";
import PasswordResetSuccess from "./components/PasswordResetSuccess";
import EventDetail from "./components/EventDetail";
import EventList from "./components/EventList";
import NotFound from "./components/NotFound";
import ProfilePage from "./components/ProfilePage";
import "./App.css";

// Componente Navbar actualizado para incluir el enlace "Crear Meetup"
const Navbar = () => {
  const { user, logout } = useUserContext();
  const location = useLocation();

  // Ocultar la Navbar en rutas de autenticación, registro o recuperación de contraseña
  if (
    location.pathname.startsWith("/login") ||
    location.pathname.startsWith("/register") ||
    location.pathname.startsWith("/password-")
  ) {
    return null;
  }

  return (
    <nav className="navbar">
      <div className="navbar-left">
        {user && (
          <>
            <Link to="/" className="navbar-link">
              Eventos
            </Link>
            <Link to="/meetups/form" className="navbar-link">
              Crear Meetup
            </Link>
            <Link to="/profile" className="navbar-link">
              Perfil
            </Link>
          </>
        )}
      </div>
      <div className="navbar-right">
        {user ? (
          <button onClick={logout} className="navbar-button">
            Cerrar Sesión
          </button>
        ) : (
          <Link to="/register" className="navbar-link">
            Registrarse
          </Link>
        )}
      </div>
    </nav>
  );
};

const App = () => {
  const [meetups, setMeetups] = useState([]);

  const handleMeetupSubmit = (meetupData) => {
    setMeetups((prevMeetups) => [...prevMeetups, meetupData]);
    console.log("Meetup creado/actualizado:", meetupData);
  };

  return (
    <UserProvider>
      <Router>
        <Navbar /> {/* Barra de navegación global */}
        <div className="App">
          <Routes>
            <Route
              path="/password-recovery"
              element={<PasswordRecoveryForm />}
            />
            <Route
              path="/password-recovery-success"
              element={<PasswordRecoverySuccess />}
            />
            <Route path="/password-reset" element={<PasswordResetForm />} />
            <Route
              path="/password-reset-success"
              element={<PasswordResetSuccess />}
            />
            <Route path="/register" element={<RegisterForm />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/validate-user" element={<UserValidationForm />} />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <EventList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/events/:id"
              element={
                <ProtectedRoute>
                  <EventDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/meetups/form/:id?"
              element={
                <ProtectedRoute>
                  <MeetupPage />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </Router>
    </UserProvider>
  );
};

export default App;
