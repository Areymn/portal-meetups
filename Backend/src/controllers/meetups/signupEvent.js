"use strict";

// ===========================================
// IMPORTS
// ===========================================

// Importar la librería Joi para validar datos de entrada
// Joi se utiliza para asegurar que los datos proporcionados cumplen con los requisitos establecidos
const Joi = require("joi");
const { updateEvent } = require("../../db/events");

// ===========================================
// BASE DE DATOS SIMULADA
// ===========================================

// ===========================================
// FUNCIÓN: INSCRIPCIÓN A UN EVENTO
// ===========================================

/**
 * Registra a un usuario en un evento específico.
 * @param {Object} req - Objeto de solicitud que contiene el id del evento y el usuario.
 * @param {Object} res - Objeto de respuesta para enviar el resultado.
 */
const signupEvent = async (req, res) => {
  try {
    // Log para depuración: imprime los datos recibidos en la solicitud
    console.log("Solicitud recibida:", req.body);

    // Definir un esquema de validación para los datos del evento
    const schema = Joi.object({
      id: Joi.number().integer().required().strict(), // ID del evento en formato numérico
      user: Joi.string().min(3).max(30).required(), // Nombre del usuario (3-30 caracteres)
    });

    // Validar los datos del cuerpo de la solicitud contra el esquema definido
    const { error, value } = schema.validate(req.body);

    // Si hay un error de validación, responder con un código 400 y el mensaje de error
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    // Agregar al usuario a la lista de asistentes del evento
    updateEvent(value.id, value.user);

    // Log de éxito
    console.log("¡Has sido añadido al evento!");

    // Responder con un código de estado 201 indicando éxito en la inscripción
    return res.status(201).json({ message: "Registrado con éxito." });
  } catch (err) {
    // Capturar y manejar cualquier error que ocurra durante el proceso
    console.error("Error en el controlador:", err.message);

    // Responder con un código de estado 500 indicando error interno del servidor
    res.status(500).json({ error: "Error interno del servidor." });
  }
};

// ===========================================
// FUNCIÓN: CANCELAR INSCRIPCIÓN A UN EVENTO
// ===========================================

/**
 * Cancela la inscripción de un usuario en un evento específico.
 * @param {Object} req - Objeto de solicitud que contiene el id del evento y el usuario.
 * @param {Object} res - Objeto de respuesta para enviar el resultado.
 */
const cancelSignup = (req, res) => {
  try {
    // Log para depuración: imprime los datos recibidos en la solicitud
    console.log("Solicitud recibida:", req.body);

    // Definir un esquema de validación para los datos del evento
    const schema = Joi.object({
      id: Joi.number().integer().required(), // ID del evento en formato numérico
      user: Joi.string().min(3).max(30).required(), // Nombre del usuario (3-30 caracteres)
    });

    // Validar los datos del cuerpo de la solicitud contra el esquema definido
    const { error, value } = schema.validate(req.body);

    // Si hay un error de validación, responder con un código 400 y el mensaje de error
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    // Buscar el evento por ID
    const event = events.find((e) => e.id === value.id);
    if (!event) {
      return res.status(404).json({ error: "Evento no encontrado." });
    }

    // Verificar si el usuario está inscrito en el evento
    const attendeeIndex = event.attendees.indexOf(value.user);
    if (attendeeIndex === -1) {
      return res
        .status(404)
        .json({ error: "Usuario no inscrito en el evento." });
    }

    // Eliminar al usuario de la lista de asistentes
    event.attendees.splice(attendeeIndex, 1);

    // Actualizar el evento en la base de datos
    updateEvent(value.id, event);

    // Confirmar la cancelación al cliente
    console.log(
      `Inscripción cancelada para el usuario ${value.user} en el evento con ID ${value.id}.`
    );
    return res
      .status(200)
      .json({ message: "Inscripción cancelada con éxito." });
  } catch (err) {
    // Capturar y manejar cualquier error
    console.error("Error en el controlador:", err.message);

    // Responder con un código de estado 500 indicando error interno del servidor
    return res.status(500).json({ error: "Error interno del servidor." });
  }
};

// ===========================================
// EXPORTACIÓN DE FUNCIONES
// ===========================================

// Exportar las funciones para que puedan ser utilizadas en otros módulos
module.exports = { signupEvent, cancelSignup };

// -------------------------------------------
// EJEMPLOS DE USO Y SALIDA
// -------------------------------------------

/*
Ejemplo de evento:
const events = [
    { id: 1, name: 'Evento A', attendees: ['User1'] },
    { id: 2, name: 'Evento B', attendees: [] },
];

1. Inscribir al usuario "User2" en el evento con ID 1:
   Llamada: signupEvents({ body: { id: 1, user: 'User2' } }, res);
   Salida:
   - Log: "¡Usuario User2 añadido al evento con ID 1!"
   - Respuesta al cliente: { message: 'Registrado con éxito.' }

2. Cancelar la inscripción del usuario "User1" del evento con ID 1:
   Llamada: cancelSignup({ body: { id: 1, user: 'User1' } }, res);
   Salida:
   - Log: "Inscripción cancelada para el usuario User1 en el evento con ID 1."
   - Respuesta al cliente: { message: 'Inscripción cancelada con éxito.' }
*/
