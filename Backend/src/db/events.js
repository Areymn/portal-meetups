"use strict";
// Para depurar: conexión falsa con la base de datos
import moment from "moment";
let eventsDB = [
  {
    id: 1,
    name: "Conferencia de networking",
    date: "2023-01-07",
    attendees: 100,
  },
  {
    id: 2,
    name: "Masterclass ciberseguridad",
    date: "2023-01-15",
    attendees: 80,
  },
];

console.log("Eventos creados al inicio (pruebas):", eventsDB);

// Crear un evento en la base de datos
function dbCreateEvent(event) {
  event.id = eventsDB.length ? eventsDB[eventsDB.length - 1].id + 1 : 1;
  eventsDB.push(event);
  return event;
}

// Actualiza un evento buscando su ID
function updateEvent(id, updatedEvent) {
  console.log(
    "Solicitud de actualización por ID recibida:",
    id,
    "Con los datos:",
    updatedEvent
  );
  // Para manejar el ID como numero
  id = Number(id);
  // Primero busca el índice de un evento por ID
  const index = eventsDB.findIndex((event) => event.id === id);
  console.log("Indice encontrado:", index);

  // Si se encontró, se actualiza
  if (index !== -1) {
    eventsDB[index] = Object.assign({}, eventsDB[index], updatedEvent);
    console.log("Evento después de la actualización:", eventsDB[index]);
    return eventsDB[index];
  }

  console.log("Evento no encontrado para actualización."); // Si no se encontró, devuelve null
  // Si no se encontró, devuelve null
  return null;
}

// Borra un evento por ID
function deleteEvent(id) {
  const index = eventsDB.findIndex((event) => event.id === id);
  if (index !== -1) {
    const deletedEvent = eventsDB.splice(index, 1);
    return deletedEvent[0];
  }
  return null;
}

// Función que busca uno o más eventos por su ID
function getEvents(id = null) {
  console.log("Buscando evento con ID:", id);
  if (id !== null) {
    id = Number(id); // Pasamos  el ID a un número
    const event = eventsDB.find((event) => event.id === id);
    console.log("Evento encontrado:", event);
    return event || null; // Devuelve el evento encontrado o null si no hay coincidencia
  }
  console.log("Devolviendo todos los eventos");
  return eventsDB; // Devuelve todos los eventos si no se especifica un ID
}

function getSortedEvents(order = "asc", sortBy = "date") {
  return eventsDB.slice().sort((a, b) => {
    if (sortBy === "date") {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return order === "asc" ? dateA - dateB : dateB - dateA;
    } else if (sortBy === "name") {
      return order === "asc"
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    }
    return [];
  });
}

// VALIDATE DATES FUNCTION
function isFutureDate(dateInput) {
  const currentDate = moment();
  const inputDate = moment(dateInput); // Convierte la fecha de entrada a un objeto moment
  if (!inputDate.isValid()) {
    console.error("Invalid date input");
    return false;
  }

  return inputDate.isAfter(currentDate); // Check if the input date is after the current date
}

export const isAdmin = (user) => {
  return user.role === "admin";
};

export {
  dbCreateEvent,
  updateEvent,
  deleteEvent,
  getEvents,
  getSortedEvents,
  isFutureDate,
  // eventsDB,
};
