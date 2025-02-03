import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useUserContext } from "../context/UserContext";

const EventDetail = () => {
  const { id } = useParams();
  const { authenticatedFetch, user } = useUserContext();
  console.log("User en EventDetail:", user);
  const [event, setEvent] = useState(null);
  const [cities, setCities] = useState([]);
  const [rating, setRating] = useState("");
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  // Cargar detalles del evento
  useEffect(() => {
    const fetchEventDetails = async () => {
      console.log("Cargando detalles del evento...");
      try {
        const data = await authenticatedFetch(
          `http://localhost:5000/api/meetups/${id}/detail`
        );
        if (!data || !data.event) {
          throw new Error("Datos del evento no válidos.");
        }
        console.log("Detalles del evento cargados:", data.event);
        setEvent(data.event);
        console.log("Attendees recibidos:", data.event.attendees);
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

  // Cargar la lista de ciudades para mostrar el nombre
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const data = await authenticatedFetch(
          "http://localhost:5000/api/meetups/cities"
        );
        setCities(data.cities);
      } catch (error) {
        console.error("Error al cargar ciudades:", error);
      }
    };
    fetchCities();
  }, [authenticatedFetch]);

  // Determinar si el evento ya ha finalizado
  const isEventFinished = event ? new Date(event.date) < new Date() : false;

  // Aseguramos que event.attendees sea un arreglo
  const attendeesArray =
    event && Array.isArray(event.attendees) ? event.attendees : [];
  // Determinar si el usuario está inscrito (comparando en forma de cadena)
  const isInscribed = attendeesArray.map(String).includes(String(user.id));

  // Debug: Mostrar en consola el arreglo de asistentes y el ID del usuario
  console.log("attendeesArray:", attendeesArray, "user.id:", user.id);

  // Función para inscribirse al evento
  const handleSignUp = async () => {
    try {
      await authenticatedFetch(
        `http://localhost:5000/api/meetups/${id}/signup`,
        {
          method: "POST",
        }
      );
      alert("Inscripción exitosa");
      // Recargar detalles del evento para actualizar la lista de asistentes
      const updatedData = await authenticatedFetch(
        `http://localhost:5000/api/meetups/${id}/detail`
      );
      console.log("Evento actualizado tras inscripción:", updatedData.event);
      setEvent(updatedData.event);
      console.log("Evento actualizado tras inscripción:", updatedData.event);
    } catch (err) {
      console.error("Error al inscribirse en el evento:", err);
      alert(err.message || "Error al inscribirse en el evento");
    }
  };

  // Buscar el nombre de la ciudad correspondiente
  const cityName =
    event && cities.length > 0
      ? cities.find((city) => city.id === event.cityId)?.name ||
        "No especificada"
      : "No especificada";

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
      const updatedData = await authenticatedFetch(
        `http://localhost:5000/api/meetups/${id}/detail`
      );
      setEvent(updatedData.event);
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
          <h2>{event.title || "Sin título"}</h2>
          <p>{event.description || "Descripción no disponible."}</p>
          <p>
            <strong>Ciudad:</strong> {cityName} - <strong>Dirección:</strong>{" "}
            {event.place || "No especificada"}
          </p>
          <p>
            <strong>Fecha:</strong> {new Date(event.date).toLocaleDateString()}
          </p>

          {/* Sección de comentarios: se muestran siempre */}
          <div className="comments-section">
            <h3>Comentarios:</h3>
            {event.comments && event.comments.length > 0 ? (
              <ul>
                {event.comments.map((comm, index) => (
                  <li key={index} className="comment-card">
                    <p>
                      <strong>
                        {comm.user_name || "Usuario desconocido"}:
                      </strong>{" "}
                      {comm.rating} ⭐
                    </p>
                    <p>{comm.comment}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No hay comentarios disponibles para este evento.</p>
            )}
          </div>

          {/* Mostrar botón para inscribirse si no está inscrito */}
          {!isInscribed ? (
            <button onClick={handleSignUp} style={{ marginBottom: "1em" }}>
              Inscribirse en el evento
            </button>
          ) : (
            <button
              disabled
              style={{
                marginBottom: "1em",
                backgroundColor: "#ccc",
                cursor: "not-allowed",
              }}
            >
              Inscrito
            </button>
          )}

          {/* Mostrar formulario de valoración solo si el usuario está inscrito */}
          {isInscribed ? (
            isEventFinished ? (
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
            ) : (
              <p>El evento aún no ha finalizado, no se puede valorar.</p>
            )
          ) : (
            <p>Debes inscribirte para poder valorar este evento.</p>
          )}

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
