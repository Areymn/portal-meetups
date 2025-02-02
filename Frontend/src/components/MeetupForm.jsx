import React, { useState, useEffect } from "react";
import { useUserContext } from "../context/UserContext";

const MeetupForm = ({ onSubmit }) => {
  // Estados para los campos del formulario
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [place, setPlace] = useState("");
  const [date, setDate] = useState("");
  const [user, setUser] = useState("");
  const [type, setType] = useState("");
  const [cityId, setCityId] = useState("");
  const [themeId, setThemeId] = useState("");

  // Estados para las opciones que se cargarán dinámicamente
  const [cities, setCities] = useState([]);
  const [themes, setThemes] = useState([]);
  const [errorOptions, setErrorOptions] = useState("");

  // Extraemos authenticatedFetch del contexto
  const { authenticatedFetch } = useUserContext();

  // Definimos de forma estática los tipos de meetup (sin Mesa Redonda)
  const meetupTypes = [
    { value: "Conferencia", label: "Conferencia" },
    { value: "Taller", label: "Taller" },
    { value: "Seminario", label: "Seminario" },
    { value: "Networking", label: "Networking" },
    { value: "Workshop", label: "Workshop" },
    { value: "Charla", label: "Charla" },
    { value: "Meetup", label: "Meetup" },
  ];

  // Cargar opciones dinámicamente al montar el componente
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        // Solicitud para obtener ciudades
        const dataCities = await authenticatedFetch(
          "http://localhost:5000/api/meetups/cities"
        );
        // Se espera que dataCities tenga la estructura: { cities: [ { id, name }, ... ] }
        setCities(dataCities.cities);

        // Solicitud para obtener temáticas
        const dataThemes = await authenticatedFetch(
          "http://localhost:5000/api/meetups/themes"
        );
        // Se espera que dataThemes tenga la estructura: { themes: [ { id, name }, ... ] }
        setThemes(dataThemes.themes);
      } catch (error) {
        console.error("Error al cargar opciones:", error);
        setErrorOptions("Error al cargar opciones");
      }
    };

    fetchOptions();
  }, [authenticatedFetch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const meetupData = {
      title,
      description,
      place,
      date,
      user,
      type,
      cityId: Number(cityId),
      themeId: Number(themeId),
    };
    onSubmit(meetupData);
    // Limpiar el formulario
    setTitle("");
    setDescription("");
    setPlace("");
    setDate("");
    setUser("");
    setType("");
    setCityId("");
    setThemeId("");
  };

  return (
    <form onSubmit={handleSubmit}>
      {errorOptions && <p style={{ color: "red" }}>{errorOptions}</p>}
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
        <label>Lugar</label>
        <input
          type="text"
          value={place}
          onChange={(e) => setPlace(e.target.value)}
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
        <label>Usuario</label>
        <input
          type="text"
          value={user}
          onChange={(e) => setUser(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Tipo</label>
        <select value={type} onChange={(e) => setType(e.target.value)} required>
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
      <button type="submit">Guardar Meetup</button>
    </form>
  );
};

export default MeetupForm;
