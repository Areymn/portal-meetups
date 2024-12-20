'use strict';

// Importar la librería Joi para validar datos de entrada
const Joi = import('joi');

// Base de datos simulada (esto es temporal y debe ser reemplazado por una base de datos real en producción)
const events = [];

// Función para crear un evento
const createEvent = async (req, res) => {
	try {
		// Log para depuración: imprime los datos recibidos en la solicitud
		console.log('Solicitud recibida:', req.body);

		// Definir un esquema de validación para los datos del evento
		const schema = Joi.object({
			name: Joi.string().min(3).max(30).required(), // El nombre del evento debe ser una cadena entre 3 y 30 caracteres
			place: Joi.string().min(3).max(30).required(), // El lugar del evento debe cumplir el mismo criterio
			time: Joi.string().date().required(), // El tiempo debe ser una fecha válida
			user: Joi.string().min(3).max(30).required(), // El usuario asociado al evento
			type: Joi.string().min(3).max(30).required(), // El tipo de evento
		});

		// Validar los datos del cuerpo de la solicitud contra el esquema definido
		const { isValidated, error } = schema.validate(req.body);

		// Si hay un error de validación, responder con un código de estado 400 y un mensaje de error
		if (!isValidated) {
			return res.status(400).json({ error: error.details[0].message });
		}

		// Extraer los datos validados del cuerpo de la solicitud
		const { name, place, time, user, type } = req.body;

		// Crear un nuevo objeto de evento con los datos recibidos
		const newEvent = { name, place, time, user, type };

		// Guardar el evento en la base de datos simulada
		events.push(newEvent);

		// Responder con un código de estado 201 indicando éxito en la creación
		return res.status(201).json({ message: 'Evento registrado con éxito.' });
	} catch (err) {
		// Capturar y manejar cualquier error que ocurra durante el proceso
		console.error('Error en el controlador:', err.message);

		// Responder con un código de estado 500 indicando error interno del servidor
		res.status(500).json({ error: 'Error interno del servidor' });
	}
};

// Función para obtener la lista de eventos (base de datos simulada)
const getEvent = () => {
	return events; // Devuelve todos los eventos almacenados
};

// Exportar las funciones para que puedan ser utilizadas en otros módulos
module.exports = { createEvent, getEvent };