"use strict";

import Joi from "joi";
import moment from "moment";
import { getEvents, updateEvent } from "../../db/events.js";

// Helper para validar que la fecha sea futura
const isFutureDate = (dateValue) => {
  return moment(dateValue).isAfter(moment());
};

export const editEvent = async (req, res) => {
  try {
    console.log("Solicitud recibida:", req.body);

    // Eliminar la propiedad "id" del cuerpo para evitar que se valide
    if (req.body.hasOwnProperty("id")) {
      delete req.body.id;
    }

    // Definir un esquema de validación para los datos del evento (sin incluir "id")
    const schema = Joi.object({
      title: Joi.string().min(3).max(500).required(),
      description: Joi.string().required(),
      place: Joi.string().min(3).max(100).required(),
      date: Joi.date().required(),
      user: Joi.string().min(3).max(30).required(),
      type: Joi.string().min(3).max(30).required(),
      cityId: Joi.number().integer().required(),
      themeId: Joi.number().integer().required(),
      attendees: Joi.array().items(Joi.number()).optional(),
    });

    const { error, value } = schema.validate(req.body, { convert: true });
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    // Obtener el id desde la URL
    const id = Number(req.params.id);
    if (!id) {
      return res.status(400).json({ error: '"id" es requerido en la URL' });
    }

    // Obtener el evento existente usando el id
    const eventData = await getEvents(id);
    if (!eventData) {
      return res.status(404).json({ error: "Evento no encontrado." });
    }

    // Combinar los datos existentes con los nuevos datos
    const updatedEvent = { ...eventData, ...value };

    // Validar que la fecha sea en el futuro
    if (!isFutureDate(updatedEvent.date)) {
      return res.status(400).json({ error: "La fecha debe ser en el futuro" });
    }

    // Actualizar el evento en la base de datos
    const result = await updateEvent(id, updatedEvent);
    console.log("Resultado de la actualización:", result);

    // Si affectedRows es 0, puede ser que no se hayan cambiado los datos,
    // pero obtenemos el evento para confirmar la actualización.
    let newEvent = updatedEvent;
    if (result.affectedRows === 0) {
      newEvent = await getEvents(id);
      console.log("Evento actualizado (sin cambios detectados):", newEvent);
      return res
        .status(200)
        .json({ message: "Evento actualizado con éxito", event: newEvent });
    } else {
      newEvent = await getEvents(id);
      console.log("Evento actualizado con éxito:", newEvent);
      return res
        .status(201)
        .json({ message: "Evento actualizado con éxito", event: newEvent });
    }
  } catch (err) {
    console.error("Error en el controlador:", err.message);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};

export default { editEvent };
