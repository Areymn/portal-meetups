'use strict';

import { getSortedEvents } from "../../db/events";
const Joi = import('joi');

// -------------------------
// FUNCIÓN ESPECÍFICA: ORDENAR EVENTOS
// -------------------------

const getEvents = async (req, res) => {
	try {

		const schema = Joi.object({
			sort: Joi.string().min(3).max(3).required(), 
			type: Joi.string().min(3).max(10).required(), 
		});

		// Validar los datos de la solicitud utilizando el esquema definido.
		const { isValidated, error } = schema.validate(req.body);

		// Si los datos no son válidos, devolver un error 400 al cliente con el detalle del error.
		if (!isValidated) {
			return res.status(400).json({ error: error.details[0].message });
		}
		
        const events = getSortedEvents(req.body.sort, req.body.type);

		// Enviar una respuesta con el código 201 para indicar que el evento fue creado exitosamente.
		return res.status(201).json({ data: events });
	} catch (err) {
		// Imprimir el mensaje de error en la consola para fines de depuración.
		console.error('Error en el controlador:', err.message);

		// Enviar una respuesta con el código 500 para indicar un error interno del servidor.
		res.status(500).json({ error: 'Error interno del servidor' });
	}
};

// -------------------------
// EXPORTAR FUNCIONES
// -------------------------

// Exportar la función `sortEvents` para que pueda ser utilizada en otros módulos.
module.exports = { getEvents };
// -------------------------
// EJEMPLOS DE USO Y SALIDA
// -------------------------

/*
Ejemplo de eventos:
const events = [
    { id: 2, name: 'Evento B', time: '2023-01-01' },
    { id: 1, name: 'Evento A', time: '2023-01-02' },
];

1. Ordenar por 'id' en orden ascendente:
   Llamada: sortEvents('id', 'asc')
   Salida:
   [
       { id: 1, name: 'Evento A', time: '2023-01-02' },
       { id: 2, name: 'Evento B', time: '2023-01-01' }
   ]

2. Ordenar por 'name' en orden descendente:
   Llamada: sortEvents('name', 'desc')
   Salida:
   [
       { id: 2, name: 'Evento B', time: '2023-01-01' },
       { id: 1, name: 'Evento A', time: '2023-01-02' }
   ]

3. Ordenar por 'time' en orden ascendente:
   Llamada: sortEvents('time', 'asc')
   Salida:
   [
       { id: 2, name: 'Evento B', time: '2023-01-01' },
       { id: 1, name: 'Evento A', time: '2023-01-02' }
   ]
*/