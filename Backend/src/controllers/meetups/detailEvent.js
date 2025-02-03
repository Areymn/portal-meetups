"use strict";

// -------------------------
// IMPORTAR DEPENDENCIAS
// -------------------------
import getPool from "../../db/getPool.js"; // Importa la conexión correcta a la base de datos

// -------------------------
// FUNCIÓN PARA VER LOS DETALLES DE UN EVENTO
// -------------------------

/**
 * Controlador para obtener los detalles de un evento específico.
 */
export const detailEvent = async (req, res) => {
  try {
    console.log("Solicitud recibida para detalles del evento:", req.params);

    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: "Se requiere el ID del evento." });
    }

    const eventId = parseInt(id, 10);
    if (isNaN(eventId)) {
      return res
        .status(400)
        .json({ error: "El ID del evento debe ser un número válido." });
    }

    const pool = await getPool();
    const [eventRows] = await pool.query("SELECT * FROM events WHERE id = ?", [
      eventId,
    ]);

    if (eventRows.length === 0) {
      console.log(`Evento con ID ${eventId} no encontrado.`);
      return res.status(404).json({ error: "Evento no encontrado." });
    }

    // Parsear el campo 'attendees'
    let parsedAttendees = [];
    const rawAttendees = eventRows[0].attendees;
    if (rawAttendees) {
      if (typeof rawAttendees === "string") {
        try {
          parsedAttendees = JSON.parse(rawAttendees);
          if (!Array.isArray(parsedAttendees)) {
            parsedAttendees = [];
          }
        } catch (e) {
          console.error("Error al parsear 'attendees':", e);
          parsedAttendees = [];
        }
      } else if (Array.isArray(rawAttendees)) {
        parsedAttendees = rawAttendees;
      }
    }
    console.log("Attendees parseados:", parsedAttendees);

    // Obtener comentarios relacionados con el evento
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

    console.log(`Detalles del evento con ID ${eventId}:`, eventRows[0]);
    console.log("Comentarios recuperados:", comments);

    return res.status(200).json({
      event: {
        ...eventRows[0],
        attendees: parsedAttendees,
        comments,
      },
    });
  } catch (err) {
    console.error("Error en el controlador de detalles del evento:", err);
    return res.status(500).json({ error: "Error interno del servidor." });
  }
};

// -------------------------
// FUNCIÓN PARA OBTENER CIUDADES
// -------------------------

/**
 * Controlador para obtener las ciudades disponibles para filtrar eventos.
 */
export const getCities = async (req, res) => {
  try {
    const pool = await getPool();
    // Se consulta la tabla 'cities' para obtener tanto el id como el nombre
    const [cities] = await pool.query(
      "SELECT id, name FROM cities ORDER BY name"
    );
    console.log("Ciudades recuperadas:", cities);
    res.status(200).json({ cities });
  } catch (error) {
    console.error("Error al obtener las ciudades:", error.message);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// -------------------------
// FUNCIÓN PARA OBTENER TEMÁTICAS
// -------------------------

/**
 * Controlador para obtener la lista de temáticas disponibles.
 */
export const getThemes = async (req, res) => {
  try {
    const pool = await getPool();
    const [themes] = await pool.query(
      "SELECT DISTINCT id, name FROM themes ORDER BY name"
    );
    console.log("Temáticas recuperadas:", themes);
    return res.status(200).json({ themes });
  } catch (error) {
    console.error("Error al obtener las temáticas:", error.message);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// -------------------------
// EXPORTAR FUNCIONES
// -------------------------
// export { detailEvent, getCities, getThemes };
