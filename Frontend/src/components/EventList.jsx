import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUserContext } from "../context/UserContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSort } from "@fortawesome/free-solid-svg-icons";

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [cities, setCities] = useState([]);
  const [themes, setThemes] = useState([]); // Estado para las temáticas
  const [error, setError] = useState("");
  const [filterCity, setFilterCity] = useState(""); // Estado para el filtro de ciudad
  const [filterTheme, setFilterTheme] = useState(""); // Estado para el filtro por temática
  const [filterDate, setFilterDate] = useState("all"); // Estado para el filtro de fechas
  const [sortOrder, setSortOrder] = useState("date"); // Estado para la ordenación
  const { token, authenticatedFetch } = useUserContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      console.log("Token no válido o ausente, redirigiendo al login...");
      navigate("/login");
      return; // Detiene la ejecución del useEffect si no hay token
    }

    console.log("Token válido, procediendo a cargar datos...");
    const fetchData = async () => {
      await fetchEvents();
      await fetchCities();
      await fetchThemes();
    };

    // Cargar eventos
    const fetchEvents = async () => {
      try {
        console.log("Iniciando la solicitud para obtener eventos...");
        const data = await authenticatedFetch(
          "http://localhost:5000/api/meetups"
        );

        if (data && Array.isArray(data.events)) {
          console.log("Datos recibidos:", data.events);
          setEvents(data.events);
        } else {
          throw new Error("Formato de respuesta inválido");
        }
      } catch (error) {
        console.error("Error al cargar los eventos:", error.message);
        setError(
          "No se pudieron cargar los eventos. Inténtalo de nuevo más tarde."
        );
      }
    };

    // Cargar ciudades dinámicamente
    const fetchCities = async () => {
      try {
        console.log("Iniciando la solicitud para obtener ciudades...");
        const data = await authenticatedFetch(
          "http://localhost:5000/api/meetups/cities"
        );

        if (data && Array.isArray(data.cities)) {
          console.log("Ciudades recibidas:", data.cities);
          setCities(data.cities);
        } else {
          throw new Error("Formato de respuesta inválido al obtener ciudades");
        }
      } catch (error) {
        console.error("Error al cargar las ciudades:", error.message);
      }
    };

    // Cargar temáticas dinámicamente
    const fetchThemes = async () => {
      try {
        console.log("Iniciando la solicitud para obtener temáticas...");
        const data = await authenticatedFetch(
          "http://localhost:5000/api/meetups/themes"
        );

        if (data && Array.isArray(data.themes)) {
          console.log("Temáticas recibidas:", data.themes);
          setThemes(data.themes);
        } else {
          throw new Error("Formato de respuesta inválido al obtener temáticas");
        }
      } catch (error) {
        console.error("Error al cargar las temáticas:", error.message);
      }
    };

    fetchEvents();
    fetchCities();
    fetchThemes();
  }, [authenticatedFetch]);

  // Filtrar y ordenar eventos
  const filteredAndSortedEvents = events
    .filter((event) => {
      const matchesCity = filterCity ? event.place === filterCity : true;
      const matchesTheme = filterTheme
        ? event.themeId === parseInt(filterTheme)
        : true;

      // Filtro de fechas
      const today = new Date();
      const eventDate = new Date(event.date);
      const matchesDate =
        filterDate === "past"
          ? eventDate < today
          : filterDate === "future"
          ? eventDate >= today
          : true;

      return matchesCity && matchesTheme && matchesDate;
    })
    .sort((a, b) => {
      if (sortOrder === "date") return new Date(a.date) - new Date(b.date);
      if (sortOrder === "title") return a.title.localeCompare(b.title);
      return 0;
    });

  return (
    <div className="event-list">
      <h1>Lista de eventos</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Controles de filtro y ordenación */}
      <form className="filter-form">
        <div className="filter-group">
          <label htmlFor="city">Filtrar por ciudad:</label>
          <select
            id="city"
            onChange={(e) => setFilterCity(e.target.value)}
            value={filterCity}
          >
            <option value="">Todas</option>
            {cities.map((city, index) => (
              <option key={index} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="theme">Filtrar por temática:</label>
          <select
            id="theme"
            onChange={(e) => setFilterTheme(e.target.value)}
            value={filterTheme}
          >
            <option value="">Todas</option>
            {themes.map((theme) => (
              <option key={theme.id} value={theme.id}>
                {theme.name}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="dateFilter">Filtrar por fecha:</label>
          <select
            id="dateFilter"
            onChange={(e) => setFilterDate(e.target.value)}
            value={filterDate}
          >
            <option value="all">Todos</option>
            <option value="past">Pasados</option>
            <option value="future">Futuros</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="sort">
            <FontAwesomeIcon icon={faSort} /> Ordenar por:
          </label>
          <select
            id="sort"
            onChange={(e) => setSortOrder(e.target.value)}
            value={sortOrder}
          >
            <option value="date">Fecha</option>
            <option value="title">Nombre</option>
          </select>
        </div>
      </form>

      {filteredAndSortedEvents.length === 0 ? (
        <p>No hay eventos disponibles.</p>
      ) : (
        <ul>
          {filteredAndSortedEvents.map((event) => (
            <li key={event.id}>
              <h3>{event.title}</h3>
              <p>{event.description}</p>
              <p>
                <strong>Lugar:</strong> {event.place}
              </p>
              <p>
                <strong>Fecha:</strong>{" "}
                {new Date(event.date).toLocaleDateString()}
              </p>
              <Link to={`/events/${event.id}`}>Ver detalles</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default EventList;
