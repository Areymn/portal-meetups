"use strict";

import moment from "moment";
import mysql from "mysql2/promise";

// Configuración de la conexión (ajusta las variables o usa variables de entorno)
const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "1234",
  database: process.env.DB_NAME || "meetup", // Cambia "mi_app" por el nombre real de tu base de datos
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// -------------------------
// OPERACIONES SOBRE EVENTOS
// -------------------------

/**
 * Crea un evento en la base de datos.
 * Se espera que el objeto event tenga las siguientes propiedades:
 * - title: string (Título del evento)
 * - description: string
 * - place: string
 * - date: datetime en formato ISO 8601 (por ejemplo, "2020-01-01T12:00:00Z")
 * - user: string
 * - type: string
 * - cityId: number
 * - themeId: number
 * - attendees (opcional): arreglo de strings; si no se envía, se inicializa como arreglo vacío.
 *
 * Nota: El campo id es AUTO_INCREMENT, por lo que no se debe enviar.
 *
 * @param {Object} event - Objeto con los datos del evento.
 * @returns {Object} - El objeto evento insertado (incluye el id generado).
 */
async function dbCreateEvent(event) {
  // Si no se proporciona attendees, se inicializa como arreglo vacío.
  if (!event.attendees) {
    event.attendees = [];
  }

  // Convertir la fecha recibida (ISO 8601) al formato MySQL: "YYYY-MM-DD HH:mm:ss"
  event.date = moment(event.date).format("YYYY-MM-DD HH:mm:ss");

  const sql = `
    INSERT INTO events (title, description, place, date, user, type, cityId, themeId, attendees)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);
  `;
  const values = [
    event.title,
    event.description,
    event.place,
    event.date, // Asegúrate de enviar la fecha en un formato aceptado (por ejemplo, ISO 8601)
    event.user,
    event.type,
    event.cityId,
    event.themeId,
    JSON.stringify(event.attendees),
  ];

  try {
    const [result] = await pool.execute(sql, values);
    // Recuperamos el id insertado
    event.id = result.insertId;
    console.log("Evento insertado en la base de datos:", event);
    return event;
  } catch (err) {
    console.error("Error al insertar el evento:", err);
    throw err;
  }
}

/**
 * Actualiza un evento existente en la base de datos.
 * Se pueden actualizar las siguientes propiedades: title, description, place, date, user, type, cityId, themeId, attendees.
 *
 * @param {string|number} id - El ID del evento a actualizar.
 * @param {Object} updatedEvent - Objeto con las propiedades a actualizar.
 * @returns {Object|null} - El evento actualizado o null si no se encontró.
 */
async function updateEvent(id, updatedEvent) {
  const fields = [];
  const values = [];

  if (updatedEvent.title !== undefined) {
    fields.push("title = ?");
    values.push(updatedEvent.title);
  }
  if (updatedEvent.description !== undefined) {
    fields.push("description = ?");
    values.push(updatedEvent.description);
  }
  if (updatedEvent.place !== undefined) {
    fields.push("place = ?");
    values.push(updatedEvent.place);
  }
  if (updatedEvent.date !== undefined) {
    fields.push("date = ?");
    values.push(updatedEvent.date);
  }
  if (updatedEvent.user !== undefined) {
    fields.push("user = ?");
    values.push(updatedEvent.user);
  }
  if (updatedEvent.type !== undefined) {
    fields.push("type = ?");
    values.push(updatedEvent.type);
  }
  if (updatedEvent.cityId !== undefined) {
    fields.push("cityId = ?");
    values.push(updatedEvent.cityId);
  }
  if (updatedEvent.themeId !== undefined) {
    fields.push("themeId = ?");
    values.push(updatedEvent.themeId);
  }
  if (updatedEvent.attendees !== undefined) {
    fields.push("attendees = ?");
    values.push(JSON.stringify(updatedEvent.attendees));
  }

  if (fields.length === 0) return null; // No hay nada que actualizar

  const sql = `UPDATE events SET ${fields.join(", ")} WHERE id = ?;`;
  values.push(id);

  try {
    const [result] = await pool.execute(sql, values);
    if (result.affectedRows === 0) {
      console.log("Evento no encontrado para actualización.");
      return null;
    }
    // Devuelve el evento actualizado consultándolo nuevamente
    return await getEvents(id);
  } catch (err) {
    console.error("Error al actualizar el evento:", err);
    throw err;
  }
}

/**
 * Borra un evento por su ID.
 * @param {string|number} id - El ID del evento a borrar.
 * @returns {boolean} - true si se eliminó, false en caso contrario.
 */
async function deleteEvent(id) {
  const sql = `DELETE FROM events WHERE id = ?;`;
  try {
    const [result] = await pool.execute(sql, [id]);
    return result.affectedRows > 0;
  } catch (err) {
    console.error("Error al borrar el evento:", err);
    throw err;
  }
}

/**
 * Obtiene eventos de la base de datos.
 * Si se proporciona un ID, devuelve ese evento; de lo contrario, devuelve todos los eventos.
 *
 * @param {string|number|null} id - El ID del evento a buscar (opcional).
 * @returns {Object|Array|null} - El evento encontrado, un arreglo de eventos o null si no hay coincidencias.
 */
async function getEvents(id = null) {
  try {
    if (id !== null) {
      const sql = `SELECT * FROM events WHERE id = ?;`;
      const [rows] = await pool.execute(sql, [id]);
      if (rows.length === 0) return null;
      const event = rows[0];
      event.attendees = event.attendees ? JSON.parse(event.attendees) : [];
      return event;
    } else {
      const sql = `SELECT * FROM events;`;
      const [rows] = await pool.execute(sql);
      for (const row of rows) {
        row.attendees = row.attendees ? JSON.parse(row.attendees) : [];
      }
      return rows;
    }
  } catch (err) {
    console.error("Error al obtener eventos:", err);
    throw err;
  }
}

/**
 * Obtiene eventos ordenados según el campo y orden indicados.
 * Se pueden ordenar por "date" o "title".
 *
 * @param {string} order - "asc" o "desc".
 * @param {string} sortBy - Campo por el cual ordenar ("date" o "title").
 * @returns {Array} - Arreglo de eventos ordenados.
 */
async function getSortedEvents(order = "asc", sortBy = "date") {
  let sql;
  if (sortBy === "date") {
    sql = `SELECT * FROM events ORDER BY date ${order.toUpperCase()};`;
  } else if (sortBy === "title") {
    sql = `SELECT * FROM events ORDER BY title ${order.toUpperCase()};`;
  } else {
    sql = `SELECT * FROM events;`;
  }

  try {
    const [rows] = await pool.execute(sql);
    for (const row of rows) {
      row.attendees = row.attendees ? JSON.parse(row.attendees) : [];
    }
    return rows;
  } catch (err) {
    console.error("Error al obtener eventos ordenados:", err);
    throw err;
  }
}

/**
 * Valida si la fecha ingresada es posterior a la fecha actual.
 * @param {any} dateInput - Fecha a validar.
 * @returns {boolean} - true si es una fecha futura, false en caso contrario.
 */
function isFutureDate(dateInput) {
  const currentDate = moment();
  const inputDate = moment(dateInput);
  if (!inputDate.isValid()) {
    console.error("Invalid date input");
    return false;
  }
  return inputDate.isAfter(currentDate);
}

export {
  dbCreateEvent,
  updateEvent,
  deleteEvent,
  getEvents,
  getSortedEvents,
  isFutureDate,
};
