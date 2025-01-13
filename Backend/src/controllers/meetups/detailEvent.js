"use strict";

// -------------------------
// IMPORTAR DEPENDENCIAS
// -------------------------

import { getEvents } from "../../db/events.js";

// -------------------------
// FUNCIÓN PARA VER LOS DETALLES DE UN EVENTO
// -------------------------

/**
 * Controlador para obtener los detalles de un evento específico.
 * @param {Object} req - La solicitud HTTP que contiene el ID del evento como parámetro o en `req.body`.
 * @param {Object} res - La respuesta HTTP que se enviará al cliente.
 */
export const detailEvent = (req, res) => {
  try {
    // Log para depuración: imprime los datos recibidos en la solicitud.
    console.log("Solicitud recibida:", req.query);

    // Validar que se haya proporcionado un ID del evento.
    const eventId = req.query.id;
    if (!eventId) {
      return res.status(400).json({ error: "Se requiere el ID del evento." });
    }

    // Convertir el ID del evento a un número entero para buscarlo.
    const id = parseInt(eventId, 10);
    if (isNaN(id)) {
      return res
        .status(400)
        .json({ error: "El ID del evento debe ser un número válido." });
    }

    // Buscar el evento con el ID proporcionado.
    const event = getEvents(id);

    // Si el evento no existe, devolver un error 404.
    if (!event) {
      return res.status(404).json({ error: "Evento no encontrado." });
    }

    // Devolver los detalles del evento al cliente.
    return res
      .status(200)
      .json({ message: "Detalles del evento encontrados.", event });
  } catch (err) {
    // Capturar y manejar cualquier error inesperado.

    // Imprimir el mensaje de error en la consola para fines de depuración.
    console.error("Error en el controlador:", err.message);

    // Enviar una respuesta con el código 500 para indicar un error interno del servidor.
    return res.status(500).json({ error: "Error interno del servidor." });
  }
};

// -------------------------
// EXPORTAR FUNCIONES
// -------------------------

// Exportar la función `getEventDetails` para que pueda ser utilizada en otros módulos.
export default { detailEvent };
