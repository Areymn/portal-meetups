"use strict";

import Joi from "joi";

const { object, number, boolean } = Joi;

export const validateEvent = async (req, res) => {
  // Log para depuración: imprime los datos enviados en la solicitud.
  console.log("Solicitud recibida:", req.body);

  // Definir un esquema de validación para los datos del evento.
  // Esto asegura que los datos proporcionados cumplen con los requisitos esperados.
  const schema = object({
    id: number().integer().required().strict(), // ID numérica del evento.
    isValid: boolean(),
  });

  // Validar los datos de la solicitud utilizando el esquema definido.
  const { isValidated, error } = schema.validate(req.body);

  // Si los datos no son válidos, devolver un error 400 al cliente con el detalle del error.
  if (!isValidated) {
    return res.status(400).json({ error: error.details[0].message });
  }

  // Busca el evento por ID
  const event = getEvents(req.body.id);
  // const event = events.find((e) => e.id === value.id);
  if (!event) {
    return res.status(404).json({ error: "Evento no encontrado." });
  }

  event["isValid"] = req.body["isValid"];

  // Reemplaza el evento original con el actualizado en la base de datos
  updateEvent(req.body.id, event);
  // events[events.indexOf(event)] = event;

  // Envia una respuesta con el código 201 para indicar que el evento fue creado exitosamente.
  return res.status(201).json({ message: "Evento validado con éxito." });
};

export default { validateEvent };
