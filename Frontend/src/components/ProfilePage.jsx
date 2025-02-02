import React, { useEffect } from "react";
import "../styles/ProfilePage.css";

import UploadAvatar from "./UploadAvatar";
import ProfileForm from "./ProfileForm";
import ChangePasswordForm from "./ChangePasswordForm";
import { useUserContext } from "../context/UserContext";

const ProfilePage = () => {
  const { user } = useUserContext();
  if (!user) return <p>Cargando perfil...</p>;

  // Aquí añadimos el useEffect para depuración del avatar:
  useEffect(() => {
    console.log("Avatar actualizado en el contexto:", user.avatar);
  }, [user.avatar]);

  // Agregamos un query param con el timestamp para evitar el cacheo del navegador
  const avatarSrc = user.avatar
    ? `http://localhost:5000/${user.avatar}?t=${new Date().getTime()}`
    : "/default-avatar.png";
  console.log("Avatar URL:", avatarSrc);

  const handleDeleteAccount = () => {
    const confirmDelete = window.confirm(
      "¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer."
    );
    if (confirmDelete) {
      console.log("Cuenta eliminada (simulado)");
      // Aquí iría la lógica para eliminar la cuenta en el backend
    }
  };

  return (
    <div className="profile-container">
      <h1 className="profile-title">Perfil de Usuario</h1>
      <div className="profile-info">
        <img
          key={user.avatar}
          src={avatarSrc}
          alt="Avatar de usuario"
          className="profile-avatar"
        />
        <h2>
          {user.name} {user.last_name}
        </h2>
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
