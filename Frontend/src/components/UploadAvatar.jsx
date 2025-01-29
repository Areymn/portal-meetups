import React, { useState } from "react";
import { useUserContext } from "../context/UserContext";

const UploadAvatar = () => {
  const { user, token, setUser } = useUserContext(); // Asegurar que token existe
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
      setPreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Por favor selecciona una imagen.");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("photo", selectedFile);

    try {
      console.log("🔄 Enviando archivo...");
      console.log("🛠️ Token antes de la solicitud:", token); // Agregar log para verificar

      const response = await fetch(
        "http://localhost:5000/api/users/profile/upload",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`, // 👈 Enviar token correctamente
          },
          body: formData,
        }
      );

      const data = await response.json();
      console.log("✅ Respuesta del servidor:", data);

      if (response.ok) {
        setUser((prevUser) => ({
          ...prevUser,
          avatar: data.filePath || "/default-avatar.png",
        }));
        alert("✅ Foto subida con éxito.");
      } else {
        throw new Error(data.error || "Error al subir la foto");
      }
    } catch (error) {
      console.error("❌ Error al subir la foto:", error.message);
      alert(`Error: ${error.message}`);
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
