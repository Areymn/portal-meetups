import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useUserContext } from "../context/UserContext";

const EventDetail = () => {
  const { id } = useParams();
  const { authenticatedFetch } = useUserContext();
  const [event, setEvent] = useState(null);
  const [rating, setRating] = useState("");
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  // Cargar detalles del evento al montar el componente
  useEffect(() => {
    const fetchEventDetails = async () => {
      console.log("Cargando detalles del evento...");
      try {
        const eventData = await authenticatedFetch(
          `http://localhost:5000/api/meetups/${id}/detail`
        );
        if (!eventData || !eventData.event) {
          throw new Error("Datos del evento no válidos.");
        }
        setEvent(eventData.event);
        console.log("Detalles del evento cargados:", eventData.event);
        console.log(
          "Comentarios del evento cargados:",
          eventData.event.comments
        );
      } catch (err) {
        setError(
          err.message ||
            "No se pudieron cargar los detalles del evento. Intenta nuevamente."
        );
        console.error("Error al cargar los detalles del evento:", err);
      }
    };
    fetchEventDetails();
  }, [id, authenticatedFetch]);

  // Manejar el envío de una valoración
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    console.log("Enviando valoración:", { rating, comment });

    try {
      await authenticatedFetch(`http://localhost:5000/api/meetups/${id}/rate`, {
        method: "POST",
        body: JSON.stringify({ rating: parseInt(rating, 10), comment }),
      });
      setSuccess("¡Valoración y comentario añadidos con éxito!");
      setRating("");
      setComment("");

      // Recargar los detalles del evento después de enviar la valoración
      const updatedEvent = await authenticatedFetch(
        `http://localhost:5000/api/meetups/${id}/detail`
      );
      setEvent(updatedEvent.event);
    } catch (err) {
      setError(err.message || "Error al enviar la valoración.");
      console.error("Error al valorar el evento:", err);
    }
  };

  return (
    <div className="event-detail">
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
      {event ? (
        <div>
          {/* Detalles del evento */}
          <h2>{event.title || "Sin título"}</h2>
          <p>{event.description || "Descripción no disponible."}</p>
          <p>
            <strong>Fecha:</strong>{" "}
            {event.date
              ? new Date(event.date).toLocaleDateString()
              : "Fecha no disponible"}
          </p>
          <p>
            <strong>Lugar:</strong> {event.place || "Lugar no especificado"}
          </p>

          {/* Mostrar comentarios */}
          <div className="comments-section">
            <h3>Comentarios:</h3>
            {event.comments && event.comments.length > 0 ? (
              <ul>
                {event.comments.map((comment, index) => (
                  <li key={index} className="comment-card">
                    <p>
                      <strong>
                        {comment.user_name || "Usuario desconocido"}:
                      </strong>{" "}
                      {comment.rating} ⭐
                    </p>
                    <p>{comment.comment}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No hay comentarios disponibles para este evento.</p>
            )}
          </div>

          {/* Formulario para valorar y comentar */}
          <form onSubmit={handleSubmit} className="rating-form">
            <h3>Valorar y comentar evento</h3>
            <div>
              <label htmlFor="rating">Puntuación (1-5):</label>
              <input
                type="number"
                id="rating"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                min="1"
                max="5"
                required
              />
            </div>
            <div>
              <label htmlFor="comment">Comentario:</label>
              <textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                maxLength="300"
                required
              ></textarea>
            </div>
            <button type="submit">Enviar valoración</button>
          </form>

          {/* Botón para volver */}
          <button onClick={() => navigate("/")} className="back-button">
            Volver
          </button>
        </div>
      ) : (
        <p>Cargando detalles del evento...</p>
      )}
    </div>
  );
};

export default EventDetail;
