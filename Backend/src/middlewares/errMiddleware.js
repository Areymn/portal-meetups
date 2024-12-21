"use strict";
// ------------------------- MANEJO DE ERRORES -------------------------

//Middleware para manejar rutas no encontradas, 404
/*app.use((req, res, next) => {
    res.status(404).json({ error: "Ruta no encontrada" });
  });
  
  // Middleware para manejar errores generales del servidor, 500
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: "Error interno del servidor" });
  });*/

  /**
 * Middleware para manejar errores de rutas no encontradas (404).
 */
const notFoundHandler = (req, res, next) => {
  res.status(404).json({ error: "Ruta no encontrada" });
};

/**
 * Middleware para manejar errores generales del servidor (500).
 */
const errorHandler = (err, req, res, next) => {
  console.error("Error de servidor:", err.stack);
  res.status(err.status || 500).json({
    error: err.message || "Error interno del servidor",
  });
};

module.exports = {
  notFoundHandler,
  errorHandler,
};