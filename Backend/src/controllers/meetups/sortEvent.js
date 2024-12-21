'use strict';

// -------------------------
// IMPORTAR DEPENDENCIAS
// -------------------------

// Importar los eventos desde el módulo correspondiente.
const { events } = import('./createEvent'); // El array `events` contiene la lista de eventos a ordenar.

// -------------------------
// FUNCIÓN GENÉRICA: ORDENAR ARRAYS POR PROPIEDAD
// -------------------------

/**
 * Ordena un array de objetos basado en una propiedad específica.
 * @param {Array} arr - El array que se desea ordenar. Ejemplo: [{ id: 1, name: "Evento A" }, { id: 2, name: "Evento B" }]
 * @param {string} property - La propiedad por la cual se ordenará el array. Ejemplo: 'id' o 'name'.
 * @param {string} order - El orden de la ordenación: 'asc' para ascendente, 'desc' para descendente. Predeterminado: 'asc'.
 * @returns {Array} El array ordenado según la propiedad y el orden proporcionados.
 */
function sortArrayByProperty(arr, property, order = 'asc') {
    return arr.sort((a, b) => {
        // Verificar si la propiedad es un número en ambos objetos.
        if (typeof a[property] === 'number' && typeof b[property] === 'number') {
            // Ordenar números: ascendente o descendente según el argumento `order`.
            return order === 'asc' ? a[property] - b[property] : b[property] - a[property];
        } 
        
        // Verificar si la propiedad es una cadena en ambos objetos.
        else if (typeof a[property] === 'string' && typeof b[property] === 'string') {
            // Ordenar cadenas alfabéticamente: ascendente o descendente según el argumento `order`.
            return order === 'asc' ? a[property].localeCompare(b[property]) : b[property].localeCompare(a[property]);
        }

        // Si los valores de la propiedad no son comparables, no alterar el orden.
        return 0;
    });
}

// -------------------------
// FUNCIÓN ESPECÍFICA: ORDENAR EVENTOS
// -------------------------

/**
 * Ordena los eventos disponibles según una propiedad y un orden proporcionados.
 * @param {string} property - La propiedad por la cual se ordenarán los eventos. Ejemplo: 'name' o 'time'.
 * @param {string} order - El orden de la ordenación: 'asc' para ascendente, 'desc' para descendente. Predeterminado: 'asc'.
 * @returns {Array} La lista de eventos ordenada.
 */
function sortEvents(property, order = 'asc') {
    // Validar que la lista de eventos existe y no está vacía.
    if (!events || events.length === 0) {
        console.error('No hay eventos para ordenar.'); // Mensaje de error si no hay eventos.
        return []; // Retorna un array vacío si no hay eventos disponibles.
    }

    // Validar que la propiedad especificada existe en los objetos de eventos.
    if (!Object.prototype.hasOwnProperty.call(events[0], property)) {
        console.error(`La propiedad "${property}" no existe en los eventos.`); // Mensaje de error si la propiedad no es válida.
        return []; // Retorna un array vacío si la propiedad no existe.
    }

    // Ordenar los eventos usando la función genérica.
    const sortedEvents = sortArrayByProperty(events, property, order);

    // Log de depuración para verificar el resultado.
    console.log('Eventos ordenados:', sortedEvents);

    return sortedEvents;
}

// -------------------------
// EXPORTAR FUNCIONES
// -------------------------

// Exportar la función `sortEvents` para que pueda ser utilizada en otros módulos.
module.exports = { sortEvents };

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