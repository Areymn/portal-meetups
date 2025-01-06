'use strict';

// -------------------------
// IMPORTAR DEPENDENCIAS
// -------------------------
import { createEvent, isFutureDate } from '../../db/events';

// Importa la librería Joi para validar los datos de entrada del usuario.
// Joi es útil para garantizar que los datos cumplan con un formato específico antes de procesarlos.
const Joi = import('joi');
const moment = import('moment');

// -------------------------
// FUNCIÓN PARA CREAR EVENTOS
// -------------------------

/**
 * Controlador para crear un nuevo evento.
 * @param {Object} req - La solicitud HTTP que contiene los datos del evento en `req.body`.
 * @param {Object} res - La respuesta HTTP que se devolverá al cliente.
 */
const createEvents = async (req, res) => {
	try {
		// Log para depuración: imprime los datos enviados en la solicitud.
		console.log('Solicitud recibida:', req.body);

		// Definir un esquema de validación para los datos del evento.
		// Esto asegura que los datos proporcionados cumplen con los requisitos esperados.
		const schema = Joi.object({
			name: Joi.string().min(3).max(30).required(), // Nombre del evento: entre 3 y 30 caracteres.
			place: Joi.string().min(3).max(30).required(), // Lugar del evento: entre 3 y 30 caracteres.
			time: Joi.string().date().required(), // Hora del evento: debe ser una fecha válida.
			user: Joi.string().min(3).max(30).required(), // Usuario asociado al evento: entre 3 y 30 caracteres.
			type: Joi.string().min(3).max(30).required(), // Tipo de evento: entre 3 y 30 caracteres.
		});

		// Validar los datos de la solicitud utilizando el esquema definido.
		const { isValidated, error } = schema.validate(req.body);

		// Si los datos no son válidos, devolver un error 400 al cliente con el detalle del error.
		if (!isValidated) {
			return res.status(400).json({ error: error.details[0].message });
		}

		// Extraer los datos validados del cuerpo de la solicitud.
		const { id, name, place, time, user, type, attendees } = req.body;

		if (!isFutureDate(time)) {
			return res.status(400).json({ error: 'Fecha no válida' });
		}

		// TODO: Generate a unique ID for event

		// Crear un nuevo objeto de evento con los datos recibidos.
		const newEvent = { id, name, place, time, user, type, attendees };

		// Agregar el nuevo evento al array `events`.
		createEvent(newEvent);

		// Log para depuración: imprime la lista actualizada de eventos.
		console.log(newEvent);

		// Enviar una respuesta con el código 201 para indicar que el evento fue creado exitosamente.
		return res.status(201).json({ message: 'Evento registrado con éxito.' });
	} catch (err) {
		// Capturar y manejar cualquier error inesperado que ocurra durante el proceso.

		// Imprimir el mensaje de error en la consola para fines de depuración.
		console.error('Error en el controlador:', err.message);

		// Enviar una respuesta con el código 500 para indicar un error interno del servidor.
		res.status(500).json({ error: 'Error interno del servidor' });
	}
};

// -------------------------
// EXPORTAR FUNCIONES
// -------------------------

// Exportar la función `createEvents` para que pueda ser utilizada en otros módulos.
module.exports = { createEvents };
