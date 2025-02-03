import React, { useState } from "react";
import { useUserContext } from "../context/UserContext";

const ProfileForm = () => {
  const { user, token, authenticatedFetch } = useUserContext();
  const [formData, setFormData] = useState({
    name: user?.name || "",
    last_name: user?.last_name || "",
    email: user?.email || "",
    currentPassword: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log("Token enviado en actualización:", token);

      console.log("🔄 Enviando solicitud de actualización con:", formData);

      const response = await authenticatedFetch(
        `http://localhost:5000/api/users/${user.id}/profile`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // 👈  token
          },
          body: JSON.stringify(formData),
        }
      );

      alert("✅ Perfil actualizado con éxito");
    } catch (error) {
      console.error("❌ Error al actualizar perfil:", error.message);
      alert(`❌ Error al actualizar perfil: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="common-page">
      <form className="profile-form" onSubmit={handleSubmit}>
        <div>
          <label>Contraseña actual</label>
          <input
            type="password"
            name="currentPassword"
            value={formData.currentPassword}
            onChange={(e) =>
              setFormData({ ...formData, currentPassword: e.target.value })
            }
            placeholder="Contraseña actual"
            required
          />
        </div>
        <div>
          <label>Nombre:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Apellido:</label>
          <input
            type="text"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Correo Electrónico:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        <div className="profile-buttons">
          <button type="submit" disabled={loading}>
            {loading ? "Actualizando..." : "Actualizar Perfil"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileForm;
