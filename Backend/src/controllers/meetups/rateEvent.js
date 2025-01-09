const db = require("../../db/events"); // Asumiendo que `events.js` maneja la "base de datos"
const { getEvents, isFutureDate, updateEvent } = require("../../db/events");
const moment = require("moment");

const rateEvent = async (req, res) => {
  const { id } = req.params; // ID del meetup
  const { rating, comment } = req.body; // Rating y comentario enviados por el usuario

  console.log("ID recibido:", id); // Muestra el ID recibido
  console.log("Puntuacion y Comentario recibido:", rating, comment); // Muestra el rating y comentario

  // Validar que el rating esté entre 1 y 5
  if (rating < 1 || rating > 5 || !Number.isInteger(rating)) {
    return res
      .status(400)
      .send("Invalid rating. It must be an integer between 1 and 5.");
  }
  // Validar comentario
  if (!comment || comment.length < 5 || comment.length > 300) {
    return res
      .status(400)
      .send("Invalid comment. It must be between 5 and 300 characters.");
  }

  try {
    const event = getEvents(id); // Encuentra el evento por ID
    console.log("Evento encontrado:", event); // Muestra el evento encontrado
    if (!event) {
      return res.status(404).send("Event not found");
    }

    console.log("Fecha del evento:", event.date); // Muestra la fecha del evento
    console.log("Es un evento futuro:", isFutureDate(moment(event.date))); // Muestra si la fecha del evento es futura

    // Comprobar que el evento ya ocurrió
    if (isFutureDate(moment(event.date))) {
      return res.status(400).send("Event has not occurred yet");
    }

    // Añadir el rating y comentario al evento
    const updatedEvent = updateEvent(Number(id), { rating, comment });
    console.log("Evento actualizado:", updatedEvent); // Muestra el evento actualizado
    if (!updatedEvent) {
      return res.status(500).send("Error updating event");
    }

    res.status(200).send("Rating added successfully");
  } catch (error) {
    console.error("Error:", error); // Muestra cualquier error del servidor
    res.status(500).send("Server error");
  }
};

module.exports = { rateEvent };
