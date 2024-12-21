'use strict';

// -------------------------------------------
// IMPORTACIONES
// -------------------------------------------

// Importar la librería Joi para validar los datos de entrada.
// Joi ayuda a garantizar que los datos proporcionados cumplen los requisitos establecidos.

const Joi = require('joi');

// -------------------------------------------
// BASE DE DATOS SIMULADA
// -------------------------------------------

// Array que actúa como una base de datos temporal para almacenar los eventos.
// NOTA: En una implementación real, esto se reemplazará con consultas a una base de datos.

const events = [
    {
        id: 1,
        name: 'Evento de ejemplo',
        place: 'Auditorio Principal',
        time: '2024-12-31T20:00:00Z',
        user: 'Organizador',
        type: 'Conferencia',
        attendees: ['Usuario1'], // Lista de asistentes iniciales
    },
];

// -------------------------------------------
// FUNCIÓN: INSCRIPCIÓN A UN EVENTO
// -------------------------------------------

/**
 * Registra a un usuario en un evento específico.
 * @param {Object} req - Objeto de solicitud que contiene los datos: ID del evento y usuario.
 * @param {Object} res - Objeto de respuesta que envía el resultado al cliente.
 */
const signupEvents = async (req, res) => {
    try {
        // Log de entrada: Muestra los datos recibidos en la solicitud.
        console.log('Solicitud recibida:', req.body);

        // Definir un esquema de validación para los datos del evento.
        const schema = Joi.object({
            id: Joi.number().integer().required().strict(), // ID del evento debe ser un número entero.
            user: Joi.string().min(3).max(30).required(), // Nombre del usuario (entre 3 y 30 caracteres).
        });

        // Validar los datos proporcionados según el esquema.
        const { error, value } = schema.validate(req.body);

        // Si hay un error de validación, responder con un código 400 y el mensaje correspondiente.
        if (error) {
            console.error('Error de validación:', error.details[0].message);
            return res.status(400).json({ error: error.details[0].message });
        }

        // Buscar el evento por su ID (usando el valor validado).
        const event = events.find((e) => e.id === value.id);
        if (!event) {
            console.error(`Evento con ID ${value.id} no encontrado.`);
            return res.status(404).json({ error: 'Evento no encontrado.' });
        }

        // Agregar al usuario a la lista de asistentes del evento.
        event.attendees.push(value.user);

        // Log de éxito: Confirmación de la inscripción.
        console.log(`¡Usuario ${value.user} añadido al evento con ID ${value.id}!`);

        // Responder con un código de estado 201 indicando éxito en la inscripción.
        return res.status(201).json({ message: 'Registrado con éxito.' });
    } catch (err) {
        // Capturar y manejar cualquier error que ocurra durante el proceso.
        console.error('Error en el controlador:', err.message);

        // Responder con un código de estado 500 indicando error interno del servidor.
        return res.status(500).json({ error: 'Error interno del servidor.' });
    }
};

// -------------------------------------------
// FUNCIÓN: CANCELAR INSCRIPCIÓN A UN EVENTO
// -------------------------------------------

/**
 * Cancela la inscripción de un usuario en un evento específico.
 * @param {Object} req - Objeto de solicitud que contiene los datos: ID del evento y usuario.
 * @param {Object} res - Objeto de respuesta que envía el resultado al cliente.
 */
const cancelSignup = (req, res) => {
    try {
        // Log de entrada: Muestra los datos recibidos en la solicitud.
        console.log('Solicitud recibida:', req.body);

        // Definir un esquema de validación para los datos del evento.
        const schema = Joi.object({
            id: Joi.number().integer().required(), // ID del evento debe ser un número entero.
            user: Joi.string().min(3).max(30).required(), // Nombre del usuario (entre 3 y 30 caracteres).
        });

        // Validar los datos proporcionados según el esquema.
        const { error, value } = schema.validate(req.body);

        // Si hay un error de validación, responder con un código 400 y el mensaje correspondiente.
        if (error) {
            console.error('Error de validación:', error.details[0].message);
            return res.status(400).json({ error: error.details[0].message });
        }

        // Buscar el evento por su ID.
        const event = events.find((e) => e.id === value.id);
        if (!event) {
            console.error(`Evento con ID ${value.id} no encontrado.`);
            return res.status(404).json({ error: 'Evento no encontrado.' });
        }

        // Verificar si el usuario está inscrito en el evento.
        const attendeeIndex = event.attendees.indexOf(value.user);
        if (attendeeIndex === -1) {
            console.error(`Usuario ${value.user} no está inscrito en el evento con ID ${value.id}.`);
            return res.status(404).json({ error: 'Usuario no inscrito en el evento.' });
        }

        // Eliminar al usuario de la lista de asistentes.
        event.attendees.splice(attendeeIndex, 1);

        // Log de éxito: Confirmación de la cancelación.
        console.log(`Inscripción cancelada para el usuario ${value.user} en el evento con ID ${value.id}.`);

        // Responder con un código de estado 200 indicando éxito en la cancelación.
        return res.status(200).json({ message: 'Inscripción cancelada con éxito.' });
    } catch (err) {
        // Capturar y manejar cualquier error.
        console.error('Error en el controlador:', err.message);

        // Responder con un código de estado 500 indicando error interno del servidor.
        return res.status(500).json({ error: 'Error interno del servidor.' });
    }
};

// -------------------------------------------
// EXPORTACIÓN DE FUNCIONES
// -------------------------------------------

// Exportar las funciones para que puedan ser utilizadas en otros módulos.
module.exports = { signupEvents, cancelSignup };

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