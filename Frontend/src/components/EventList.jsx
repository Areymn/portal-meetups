import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useUserContext } from "../context/UserContext";

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState("");
  const { authenticatedFetch } = useUserContext();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        console.log("Iniciando la solicitud para obtener eventos...");
        const data = await authenticatedFetch(
          "http://localhost:5000/api/meetups"
        );

        console.log("Respuesta de la solicitud:", data);
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

    fetchEvents();
  }, [authenticatedFetch]);

  return (
    <div className="event-list">
      <h1>Lista de eventos</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {events.length === 0 ? (
        <p>No hay eventos disponibles.</p>
      ) : (
        <ul>
          {events.map((event) => (
            <li key={event.id}>
              <h3>{event.title}</h3>
              <p>{event.description}</p>
              <Link to={`/events/${event.id}`}>Ver detalles</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default EventList;
