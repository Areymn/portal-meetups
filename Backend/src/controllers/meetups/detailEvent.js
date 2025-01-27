"use strict";

// -------------------------
// IMPORTAR DEPENDENCIAS
// -------------------------
import getPool from "../../db/getPool.js";

// -------------------------
// FUNCIÓN PARA VER LOS DETALLES DE UN EVENTO
// -------------------------

/**
 * Controlador para obtener los detalles de un evento específico.
 * @param {Object} req - La solicitud HTTP que contiene el ID del evento como parámetro en `req.params`.
 * @param {Object} res - La respuesta HTTP que se enviará al cliente.
 */
export const detailEvent = async (req, res) => {
  try {
    // Log para depuración: imprime los datos recibidos en la solicitud.
    console.log("Solicitud recibida para detalles del evento:", req.params);

    // Validar que se haya proporcionado un ID del evento.
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: "Se requiere el ID del evento." });
    }

    // Convertir el ID del evento a un número entero para buscarlo.
    const eventId = parseInt(id, 10);
    if (isNaN(eventId)) {
      return res
        .status(400)
        .json({ error: "El ID del evento debe ser un número válido." });
    }

    // Obtener el pool de conexiones y consultar la base de datos
    const pool = await getPool();
    const [event] = await pool.query("SELECT * FROM events WHERE id = ?", [
      eventId,
    ]);

    // Verificar si el evento fue encontrado
    if (event.length === 0) {
      console.log(`Evento con ID ${eventId} no encontrado.`);
      return res.status(404).json({ error: "Evento no encontrado." });
    }

    const [comments] = await pool.query(
      `SELECT 
         event_ratings.user_id, 
         event_ratings.rating, 
         event_ratings.comment, 
         users.username AS user_name 
       FROM event_ratings
       INNER JOIN users ON event_ratings.user_id = users.id
       WHERE event_ratings.event_id = ?`,
      [id]
    );

    event.comments = comments; // Agrega los comentarios al objeto del evento
    console.log("Comentarios recuperados:", comments);

    // Log para depuración: Detalles del evento encontrado
    console.log(`Detalles del evento con ID ${eventId}:`, event[0]);

    // Devolver los detalles del evento al cliente
    return res.status(200).json({ event: { ...event[0], comments } });
  } catch (err) {
    // Capturar y manejar cualquier error inesperado.
    console.error("Error en el controlador de detalles del evento:", err);

    // Enviar una respuesta con el código 500 para indicar un error interno del servidor.
    return res.status(500).json({ error: "Error interno del servidor." });
  }
};

// -------------------------
// EXPORTAR FUNCIONES
// -------------------------
export default { detailEvent };
