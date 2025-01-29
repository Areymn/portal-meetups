import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Link,
  useLocation, // 👈 Nuevo Hook para controlar la ubicación
} from "react-router-dom";
import "./styles.css";
import { UserProvider, useUserContext } from "./context/UserContext";
import MeetupForm from "./components/MeetupForm";
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

// ✅ Navbar solo se muestra si NO estamos en Login o Register
const Navbar = () => {
  const { user, logout } = useUserContext();
  const location = useLocation();

  // Ocultar Navbar en Login y Registro
  if (location.pathname === "/login" || location.pathname === "/register") {
    return null;
  }

  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "10px",
        background: "#007bff",
      }}
    >
      <div>
        {user && (
          <Link
            to="/"
            style={{
              marginRight: "15px",
              color: "#fff",
              textDecoration: "none",
            }}
          >
            Eventos
          </Link>
        )}
        {user && (
          <Link to="/profile" style={{ color: "#fff", textDecoration: "none" }}>
            Perfil
          </Link>
        )}
      </div>
      <div>
        {user ? (
          <button
            onClick={logout}
            style={{
              background: "#dc3545",
              color: "#fff",
              border: "none",
              padding: "8px 12px",
              cursor: "pointer",
            }}
          >
            Cerrar Sesión
          </button>
        ) : (
          <Link
            to="/register"
            style={{ color: "#fff", textDecoration: "none" }}
          >
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
        <Navbar /> {/* ✅ Ahora solo aparece en páginas protegidas */}
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
              path="/meetups/form"
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

            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </Router>
    </UserProvider>
  );
};

export default App;
