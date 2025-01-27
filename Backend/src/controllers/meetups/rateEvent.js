"use strict";

import getPool from "../../db/getPool.js"; // Conexión a la base de datos

export const rateEvent = async (req, res) => {
  console.log("Usuario autenticado para valoración:", req.user);

  const { id } = req.params; // ID del meetup
  const { rating, comment } = req.body; // Datos enviados en la solicitud
  const userId = req.user?.user_id; // Extrae el ID del usuario autenticado
  const eventId = id; // ID del evento desde req.params

  console.log("ID del evento recibido:", eventId);
  console.log("Puntuación y comentario recibidos:", rating, comment);

  // Validar que el usuario esté autenticado
  if (!userId) {
    return res.status(401).json({ error: "Usuario no autenticado" });
  }

  // Validar que el rating esté entre 1 y 5
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return res
      .status(400)
      .json({ error: "Puntuación inválida. Debe ser un número entre 1 y 5." });
  }

  // Validar el comentario
  if (!comment || comment.length < 5 || comment.length > 300) {
    return res.status(400).json({
      error: "Comentario inválido. Debe contener entre 5 y 300 caracteres.",
    });
  }

  try {
    const pool = await getPool();

    // Validar que el evento existe
    const [event] = await pool.query("SELECT * FROM events WHERE id = ?", [
      eventId,
    ]);
    if (!event.length) {
      console.log(`Evento con ID ${eventId} no encontrado.`);
      return res.status(404).json({ error: "Evento no encontrado." });
    }

    // Verificar que el evento ya ocurrió
    const eventDate = new Date(event[0].date);
    if (eventDate > new Date()) {
      console.log(
        `El evento con ID ${eventId} aún no ha ocurrido. Fecha del evento: ${eventDate}`
      );
      return res
        .status(400)
        .json({ error: "El evento aún no ha ocurrido. No se puede valorar." });
    }

    // Verificar si el usuario ya valoró este evento
    const [existingRating] = await pool.query(
      "SELECT * FROM event_ratings WHERE event_id = ? AND user_id = ?",
      [eventId, userId]
    );
    if (existingRating.length > 0) {
      console.log(
        `El usuario con ID ${userId} ya valoró el evento con ID ${eventId}.`
      );
      return res.status(400).json({
        error: "Ya has valorado este evento. No puedes valorarlo de nuevo.",
      });
    }

    // Insertar el rating y comentario en la tabla `event_ratings`
    const [insertResult] = await pool.query(
      "INSERT INTO event_ratings (event_id, user_id, rating, comment) VALUES (?, ?, ?, ?)",
      [eventId, userId, rating, comment]
    );

    // Confirmación en logs
    console.log(
      `Puntuación añadida exitosamente. ID del registro: ${insertResult.insertId}`
    );
    console.log(`Evento ID: ${eventId}, Usuario ID: ${userId}`);
    console.log(`Rating: ${rating}, Comentario: "${comment}"`);

    // Respuesta exitosa
    res.status(201).json({
      message: "Valoración y comentario añadidos correctamente.",
    });
  } catch (error) {
    console.error("Error al valorar el evento:", error);
    res.status(500).json({ error: "Error interno del servidor." });
  }
};

export default { rateEvent };
