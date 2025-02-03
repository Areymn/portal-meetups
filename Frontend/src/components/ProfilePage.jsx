import React, { useEffect } from "react";
import "../styles/ProfilePage.css";

import UploadAvatar from "./UploadAvatar";
import ProfileForm from "./ProfileForm";
import ChangePasswordForm from "./ChangePasswordForm";
import { useUserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const { user, logout, authenticatedFetch } = useUserContext();
  const navigate = useNavigate();

  if (!user) return <p>Cargando perfil...</p>;

  useEffect(() => {
    console.log("Avatar actualizado en el contexto:", user.avatar);
  }, [user.avatar]);

  // Agregamos un query param para evitar cacheo en el avatar
  const avatarSrc = user.avatar
    ? `http://localhost:5000/${user.avatar}?t=${new Date().getTime()}`
    : "/default-avatar.png";
  console.log("Avatar URL:", avatarSrc);

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm(
      "¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer."
    );
    if (confirmDelete) {
      try {
        // Llamar al endpoint para borrar la cuenta (DELETE /api/users/me)
        await authenticatedFetch("http://localhost:5000/api/users/me", {
          method: "DELETE",
        });
        alert("Cuenta eliminada con éxito");
        // Se elimina la cuenta y se cierra la sesión:
        logout(); // Esta función ya limpia localStorage y actualiza el estado
        navigate("/login");
      } catch (error) {
        console.error("Error al eliminar la cuenta:", error);
        alert("Error al eliminar la cuenta");
      }
    }
  };

  return (
    <div className="profile-container">
      <h1 className="profile-title">
        {user.name} {user.last_name}
      </h1>
      <div className="profile-info">
        <img
          key={user.avatar}
          src={avatarSrc}
          alt="Avatar de usuario"
          className="profile-avatar"
        />
        <h2>{user.username}</h2>
        <p>{user.email}</p>
      </div>

      <UploadAvatar />
      <ProfileForm />
      <ChangePasswordForm />

      <div className="">
        <button onClick={handleDeleteAccount} className="delete-account-btn">
          Eliminar Cuenta
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
