import React, { useState } from "react";
import { useUserContext } from "../context/UserContext";

const ChangePasswordForm = () => {
  const { user, authenticatedFetch } = useUserContext();
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (formData.newPassword !== formData.confirmNewPassword) {
      alert("Las nuevas contraseñas no coinciden");
      setLoading(false);
      return;
    }

    try {
      await authenticatedFetch(
        `http://localhost:5000/api/users/${user.id}/change-password`,
        {
          method: "POST",
          body: JSON.stringify({
            currentPassword: formData.currentPassword,
            newPassword: formData.newPassword,
          }),
        }
      );

      alert("Contraseña actualizada con éxito");
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });
    } catch (error) {
      alert("Error al cambiar la contraseña: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="profile-form" onSubmit={handleSubmit}>
      <h3>Cambiar Contraseña</h3>
      <div>
        <label>Contraseña Actual:</label>
        <input
          type="password"
          name="currentPassword"
          value={formData.currentPassword}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Nueva Contraseña:</label>
        <input
          type="password"
          name="newPassword"
          value={formData.newPassword}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Confirmar Nueva Contraseña:</label>
        <input
          type="password"
          name="confirmNewPassword"
          value={formData.confirmNewPassword}
          onChange={handleChange}
          required
        />
      </div>
      <div className="profile-buttons">
        <button type="submit" disabled={loading}>
          {loading ? "Cambiando..." : "Cambiar Contraseña"}
        </button>
      </div>
    </form>
  );
};

export default ChangePasswordForm;
