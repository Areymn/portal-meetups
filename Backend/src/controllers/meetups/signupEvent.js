// src/controllers/meetups/signUpEvent.js
import getPool from "../../db/getPool.js";

export const signUpEvent = async (req, res) => {
  try {
    const eventId = req.params.id;
    // Usamos req.user.id, pero agregamos un chequeo
    const userId = req.user && req.user.id;
    if (!userId) {
      console.error("Usuario no autenticado, req.user:", req.user);
      return res.status(401).json({ error: "Usuario no autenticado" });
    }
    console.log("User ID para inscripción:", userId);

    const pool = await getPool();

    // Obtener el campo 'date' y 'attendees' del evento
    const [rows] = await pool.query(
      "SELECT date, attendees FROM events WHERE id = ?",
      [eventId]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: "Evento no encontrado" });
    }

    // Verificar que el evento sea futuro
    const eventDate = new Date(rows[0].date);
    const now = new Date();
    if (eventDate < now) {
      return res
        .status(400)
        .json({ error: "No se puede inscribir en eventos pasados" });
    }

    // Inicializar attendees como arreglo vacío si no existe o no es un arreglo
    let attendees = [];
    const rawAttendees = rows[0].attendees;
    if (rawAttendees) {
      try {
        const parsed = JSON.parse(rawAttendees);
        attendees = Array.isArray(parsed) ? parsed : [];
      } catch (e) {
        console.error("Error al parsear 'attendees':", e);
        attendees = [];
      }
    }
    console.log("Attendees antes de inscripción:", attendees);

    // Comparar usando conversión a cadena para evitar discrepancias
    const userIdStr = String(userId);
    const attendeeIds = attendees.map(String);
    if (attendeeIds.includes(userIdStr)) {
      return res
        .status(400)
        .json({ error: "Ya estás inscrito en este evento" });
    }

    // Agregar el ID del usuario a la lista de asistentes
    attendees.push(userId);
    const [result] = await pool.query(
      "UPDATE events SET attendees = ? WHERE id = ?",
      [JSON.stringify(attendees), eventId]
    );
    console.log("Resultado de la actualización:", result);
    console.log("Attendees después de inscripción:", attendees);

    if (result.affectedRows > 0) {
      return res.status(200).json({ message: "Inscripción exitosa" });
    } else {
      return res
        .status(500)
        .json({ error: "No se pudo actualizar la inscripción" });
    }
  } catch (error) {
    console.error("Error al inscribirse al evento:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};
