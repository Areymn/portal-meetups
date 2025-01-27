import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useUserContext } from "../context/UserContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSort } from "@fortawesome/free-solid-svg-icons";

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [cities, setCities] = useState([]);
  const [error, setError] = useState("");
  const [filterCity, setFilterCity] = useState(""); // Estado para el filtro de ciudad
  const [sortOrder, setSortOrder] = useState("date"); // Estado para la ordenación
  const { authenticatedFetch } = useUserContext();

  useEffect(() => {
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

    fetchEvents();
    fetchCities();
  }, [authenticatedFetch]);

  // Filtrar y ordenar eventos
  const filteredAndSortedEvents = events
    .filter((event) => {
      return filterCity ? event.place === filterCity : true;
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
