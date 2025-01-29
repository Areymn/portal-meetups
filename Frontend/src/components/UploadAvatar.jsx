import React, { useState } from "react";
import { useUserContext } from "../context/UserContext";

const UploadAvatar = () => {
  const { user, setUser } = useUserContext();
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("photo", file);

    try {
      const response = await fetch(
        "http://localhost:5000/api/users/profile/upload",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
          body: formData,
        }
      );

      const data = await response.json();
      if (response.ok) {
        setUser({ ...user, avatar: data.filePath });
        alert("Foto de perfil actualizada con éxito");
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error("Error al subir la foto", error);
      alert("Error al subir la foto");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h3>Cambiar Foto de Perfil</h3>
      <form className="form">
        <div>
          <label htmlFor="fileUpload">Selecciona una imagen</label>
          <input
            type="file"
            id="fileUpload"
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>

        {preview && (
          <div className="avatar-preview-container">
            <img src={preview} alt="Vista previa" className="avatar-preview" />
          </div>
        )}

        <button type="button" onClick={handleUpload} disabled={loading}>
          {loading ? "Subiendo..." : "Actualizar Foto"}
        </button>
      </form>
    </div>
  );
};

export default UploadAvatar;
