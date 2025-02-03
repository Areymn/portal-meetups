"use strict";

// -------------------------
// IMPORTAR DEPENDENCIAS
// -------------------------
import { dbCreateEvent } from "../../db/events.js";
import Joi from "joi";
import moment from "moment";

// Función para validar si la fecha es futura
const isFutureDate = (date) => {
  const currentDate = moment();
  return date.isAfter(currentDate);
};

/**
 * Controlador para crear un nuevo evento.
 * Se espera que el objeto en req.body tenga las siguientes propiedades:
 * - title: string (Título del evento)
 * - description: string (Descripción del evento)
 * - place: string (Dirección del evento)
 * - date: date (Fecha y hora del evento; se validará que no sea en el futuro)
 * - user: string (Usuario asociado al evento)
 * - type: string (Tipo de evento)
 * - cityId: number (ID de la ciudad)
 * - themeId: number (ID del tema)
 * - attendees (opcional): arreglo de números (IDs de usuarios inscritos)
 */
export const createEvents = async (req, res) => {
  try {
    console.log("Solicitud recibida:", req.body);

    // Definir un esquema de validación para los datos del evento
    const schema = Joi.object({
      title: Joi.string().min(3).max(500).required(),
      description: Joi.string().required(),
      place: Joi.string().min(3).max(100).required(),
      date: Joi.date().required(),
      user: Joi.string().required(),
      type: Joi.string().required(),
      cityId: Joi.number().integer().required(),
      themeId: Joi.number().integer().required(),
      attendees: Joi.array().items(Joi.number()).optional(),
    });

    // Validar los datos de la solicitud
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    // Extraer los datos validados
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

    // Validar que la fecha no sea en el futuro
    if (isFutureDate(moment(date))) {
      return res.status(400).send("Event has not occurred yet");
    }

    // Asegurarse de que 'attendees' sea un arreglo; si no se envía o no es un arreglo, se inicializa como vacío
    if (!attendees || !Array.isArray(attendees)) {
      attendees = [];
    }

    // Crear el objeto de evento
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

    // Insertar el evento en la base de datos
    await dbCreateEvent(newEvent);
    console.log("Evento creado:", newEvent);

    return res
      .status(201)
      .json({ message: "Evento registrado con éxito.", event: newEvent });
  } catch (err) {
    console.error("Error en el controlador:", err.message);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};

export default { createEvents };
