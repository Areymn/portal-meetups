"use strict";

// -------------------------
// IMPORTAR DEPENDENCIAS
// -------------------------
import {
  dbCreateEvent,
  updateEvent,
  deleteEvent,
  getEvents,
  getSortedEvents,
  isFutureDate,
} from "../../db/events.js";

// Importa la librería Joi para validar los datos de entrada del usuario.
import Joi from "joi";
const { object, string, number, array } = Joi;
import moment from "moment";

// -------------------------
// FUNCIÓN PARA CREAR EVENTOS
// -------------------------

/**
 * Controlador para crear un nuevo evento.
 * Se espera que el objeto en req.body tenga las siguientes propiedades:
 * - title: string (Título del evento)
 * - description: string (Descripción del evento)
 * - place: string (Lugar del evento)
 * - date: date (Fecha y hora del evento; debe ser en el pasado)
 * - user: string (Usuario asociado al evento)
 * - type: string (Tipo de evento)
 * - cityId: number (ID de la ciudad)
 * - themeId: number (ID del tema)
 * - attendees (opcional): arreglo de strings
 *
 * @param {Object} req - La solicitud HTTP que contiene los datos del evento en `req.body`.
 * @param {Object} res - La respuesta HTTP que se devolverá al cliente.
 */
export const createEvents = async (req, res) => {
  try {
    // Log para depuración: imprime los datos enviados en la solicitud.
    console.log("Solicitud recibida:", req.body);

    // Definir un esquema de validación para los datos del evento.
    const schema = Joi.object({
      title: Joi.string().min(3).max(500).required(),
      description: Joi.string().required(),
      place: Joi.string().min(3).max(100).required(),
      date: Joi.date().required(),
      user: Joi.string().min(3).max(30).required(),
      type: Joi.string().min(3).max(30).required(),
      cityId: Joi.number().integer().required(),
      themeId: Joi.number().integer().required(),
      attendees: Joi.array().items(Joi.string()).optional(),
    });

    // Validar los datos de la solicitud utilizando el esquema definido.
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    // Extraer los datos validados del cuerpo de la solicitud.
    let {
      title,
      description,
      place,
      date,
      user,
      type,
      cityId,
      themeId,
      attendees,
    } = req.body;

    // Verificar que la fecha no sea en el futuro.
    if (isFutureDate(moment(date))) {
      return res.status(400).send("Event has not occurred yet");
    }

    // Si no se proporcionan asistentes, se inicializa como un arreglo vacío.
    if (!attendees) {
      attendees = [];
    }

    // Crear un nuevo objeto de evento con los datos recibidos.
    const newEvent = {
      title,
      description,
      place,
      date,
      user,
      type,
      cityId,
      themeId,
      attendees,
    };

    // Intentar crear el evento en la base de datos.
    await dbCreateEvent(newEvent);

    // Log para depuración: imprime el evento creado.
    console.log("Evento creado:", newEvent);

    // Enviar una respuesta exitosa.
    return res
      .status(201)
      .json({ message: "Evento registrado con éxito.", event: newEvent });
  } catch (err) {
    // Capturar y manejar cualquier error inesperado.
    console.error("Error en el controlador:", err.message);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};

// -------------------------
// EXPORTAR FUNCIONES
// -------------------------
export default { createEvents };
