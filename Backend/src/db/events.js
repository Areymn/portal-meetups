// Para depurar: conexión falsa con la base de datos
let eventsDB = [];

// Crear un evento en la base de
function createEvent(event) {
  event.id = eventsDB.length ? eventsDB[eventsDB.length - 1].id + 1 : 1;
  eventsDB.push(event);
  return event;
}

// Actualiza un evento buscando su ID
function updateEvent(id, updatedEvent) {
    // Primero busca el índice de un evento por ID
    const index = eventsDB.findIndex(function(event) {
        return event.id === id;
    });

    // Si se encontró, se actualiza
    if (index !== -1) {
        eventsDB[index] = Object.assign({}, eventsDB[index], updatedEvent);
        return eventsDB[index];
    }

    // Si no se encontró, devuelve null
    return null;
}

// Borra un evento por ID
function deleteEvent(id) {
  const index = eventsDB.findIndex(event => event.id === id);
  if (index !== -1) {
    const deletedEvent = eventsDB.splice(index, 1);
    return deletedEvent[0];
  }
  return null;
}

// Función que busca uno o más eventos por su ID
function getEvents(id = null) {
  if (id !== null) {
    return eventsDB.find(event => event.id === id) || null;
  }
  return eventsDB;
}

function getSortedEvents(order = 'asc', sortBy = 'date') {
    return eventsDB.slice().sort((a, b) => {
        if (sortBy === 'date') {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            return order === 'asc' ? dateA - dateB : dateB - dateA;
        } else if (sortBy === 'name') {
            return order === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
        }
        return [];
    });
}

export { createEvent, updateEvent, deleteEvent, getEvents };