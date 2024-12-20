'use strict';

// Importar los eventos desde el módulo correspondiente
const { events } = import('./createEvent'); 

// -------------------------
// FUNCIÓN GENÉRICA: ORDENAR ARREGLOS POR PROPIEDAD
// -------------------------

/**
 * Ordena un arreglo de objetos basado en una propiedad específica.
 * @param {Array} arr - El array que se desea ordenar.
 * @param {string} property - La propiedad por la cual se ordenará el arreglo.
 * @param {string} order - El orden de la ordenación: 'asc' para ascendente, 'desc' para descendente.
 * @returns {Array} El array ordenado.
 */
function sortArrayByProperty(arr, property, order = 'asc') {
    return arr.sort((a, b) => {
        // Verificar si la propiedad es de tipo número en ambos objetos.
        if (typeof a[property] === 'number' && typeof b[property] === 'number') {
            // Ordenar números: ascendente o descendente según el argumento `order`.
            return order === 'asc' ? a[property] - b[property] : b[property] - a[property];
        } 
        // Verificar si la propiedad es de tipo string en ambos objetos.
        else if (typeof a[property] === 'string' && typeof b[property] === 'string') {
            // Ordenar cadenas alfabéticamente: ascendente o descendente según el argumento `order`.
            return order === 'asc' ? a[property].localeCompare(b[property]) : b[property].localeCompare(a[property]);
        } 
        // Si los tipos no son comparables (ni número ni cadena), mantener el orden original.
        else {
            return 0;
        }
    });
}

// -------------------------
// FUNCIÓN ESPECÍFICA: ORDENAR EVENTOS
// -------------------------

/**
 * Ordena los eventos disponibles según una propiedad y un orden proporcionados.
 * @param {string} property - La propiedad por la cual se ordenarán los eventos.
 * @param {string} order - El orden de la ordenación: 'asc' para ascendente, 'desc' para descendente.
 * @returns {Array} La lista de eventos ordenada.
 */
function sortEvents(property, order = 'asc') {
    // Validar que la lista de eventos exista y no esté vacía.
    if (!events || events.length === 0) {
        console.error('No hay eventos para ordenar.'); // Mensaje de error si no hay eventos.
        return []; // Retornar un array vacío si no hay eventos disponibles.
    }

    // Validar que la propiedad especificada exista en los objetos de eventos.
    if (!Object.prototype.hasOwnProperty.call(events[0], property)) {
        console.error(`La propiedad "${property}" no existe en los eventos.`); // Mensaje de error si la propiedad no es válida.
        return []; // Retornar un array vacío si la propiedad no existe.
    }

    // Llamar a la función genérica para ordenar el arreglo de eventos.
    return sortArrayByProperty(events, property, order);
}

// -------------------------
// EXPORTAR FUNCIONES
// -------------------------

// Exportar la función `sortEvents` para que pueda ser utilizada en otros módulos.
module.exports = { sortEvents };

