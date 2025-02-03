import React, { useState, useEffect } from "react";
import { useUserContext } from "../context/UserContext";
import { useParams, useNavigate } from "react-router-dom";

const MeetupForm = ({ onSubmit }) => {
  const { authenticatedFetch, user } = useUserContext();
  const { id } = useParams(); // Modo edición si existe id
  const navigate = useNavigate();

  // Estados para los campos del formulario
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [cityId, setCityId] = useState("");
  const [place, setPlace] = useState("");
  const [type, setType] = useState("");
  const [themeId, setThemeId] = useState("");

  // Estados para las opciones dinámicas
  const [cities, setCities] = useState([]);
  const [themes, setThemes] = useState([]);
  const [errorOptions, setErrorOptions] = useState("");

  // Definir tipos estáticos
  const meetupTypes = [
    { value: "Conferencia", label: "Conferencia" },
    { value: "Taller", label: "Taller" },
    { value: "Seminario", label: "Seminario" },
    { value: "Networking", label: "Networking" },
    { value: "Workshop", label: "Workshop" },
    { value: "Charla", label: "Charla" },
    { value: "Meetup", label: "Meetup" },
  ];

  // En modo creación, el usuario se obtiene del contexto y se muestra como info (no editable)
  const userField = user ? user.username : "";

  // Cargar opciones dinámicamente
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const dataCities = await authenticatedFetch(
          "http://localhost:5000/api/meetups/cities"
        );
        setCities(dataCities.cities);
        const dataThemes = await authenticatedFetch(
          "http://localhost:5000/api/meetups/themes"
        );
        setThemes(dataThemes.themes);
      } catch (error) {
        console.error("Error al cargar opciones:", error);
        setErrorOptions("Error al cargar opciones");
      }
    };
    fetchOptions();
  }, [authenticatedFetch]);

  // Si hay un ID, cargar datos del meetup para editar
  useEffect(() => {
    if (id) {
      const fetchMeetup = async () => {
        try {
          const data = await authenticatedFetch(
            `http://localhost:5000/api/meetups/${id}/detail`
          );
          if (data && data.event) {
            setTitle(data.event.title);
            setDescription(data.event.description);
            setCityId(data.event.cityId);
            setPlace(data.event.place);
            setDate(new Date(data.event.date).toISOString().slice(0, 16));
            // En modo edición, se asume que data.event.user contiene el username del creador
            // Si no deseas permitir modificar el usuario, simplemente no actualices userField
            setType(data.event.type);
            setThemeId(data.event.themeId);
          }
        } catch (error) {
          console.error("Error al cargar el meetup para editar:", error);
        }
      };
      fetchMeetup();
    }
  }, [id, authenticatedFetch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const meetupData = {
      title,
      description,
      date,
      cityId: Number(cityId),
      place,
      user: userField, // Se usa el username del contexto, no editable
      type,
      themeId: Number(themeId),
    };

    try {
      if (id) {
        // Modo edición: PUT
        const updatedData = await authenticatedFetch(
          `http://localhost:5000/api/meetups/${id}`,
          {
            method: "PUT",
            body: JSON.stringify(meetupData),
          }
        );
        alert("Meetup actualizado con éxito");
        onSubmit(updatedData.event);
      } else {
        // Modo creación: POST
        const createdData = await authenticatedFetch(
          "http://localhost:5000/api/meetups",
          {
            method: "POST",
            body: JSON.stringify(meetupData),
          }
        );
        alert("Meetup creado con éxito");
        onSubmit(createdData.event);
      }
      setTitle("");
      setDescription("");
      setCityId("");
      setPlace("");
      setDate("");
      setType("");
      setThemeId("");
      navigate("/");
    } catch (error) {
      console.error("Error al enviar el formulario:", error);
      alert("Error al enviar el formulario");
    }
  };

  return (
    <div className="common-page">
      <form onSubmit={handleSubmit}>
        {errorOptions && <p style={{ color: "red" }}>{errorOptions}</p>}

        {/* Mostrar la información del usuario (no editable) en la parte superior */}
        <div>
          <p>
            <strong>Creado por:</strong> {userField}
          </p>
        </div>

        <div>
          <label>Título</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Descripción</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Fecha y hora</label>
          <input
            type="datetime-local"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Tipo</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            required
          >
            <option value="">Selecciona un tipo</option>
            {meetupTypes.map((mt) => (
              <option key={mt.value} value={mt.value}>
                {mt.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Ciudad</label>
          <select
            value={cityId}
            onChange={(e) => setCityId(e.target.value)}
            required
          >
            <option value="">Selecciona una ciudad</option>
            {cities.map((city) => (
              <option key={city.id} value={city.id}>
                {city.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Dirección</label>
          <input
            type="text"
            value={place}
            onChange={(e) => setPlace(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Tema</label>
          <select
            value={themeId}
            onChange={(e) => setThemeId(e.target.value)}
            required
          >
            <option value="">Selecciona un tema</option>
            {themes.map((theme) => (
              <option key={theme.id} value={theme.id}>
                {theme.name}
              </option>
            ))}
          </select>
        </div>
        <button type="submit">
          {id ? "Actualizar Meetup" : "Guardar Meetup"}
        </button>
      </form>
    </div>
  );
};

export default MeetupForm;
