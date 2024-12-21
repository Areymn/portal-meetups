/*app.use(
  cors({
    origin: "*", // Permite todas las solicitudes (puedes restringirlo a dominios específicos)
    methods: ["GET", "POST", "PUT", "DELETE"], // Métodos HTTP permitidos
    allowedHeaders: ["Content-Type", "Authorization"], // Cabeceras permitidas
  })
);*/

"use strict";

const cors = require("cors"); // Importar la librería cors

// Middleware para permitir solicitudes CORS
const corsMiddleware = cors({
  origin: "*", // Permite todas las solicitudes (puedes restringirlo a dominios específicos)
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Métodos HTTP permitidos
  allowedHeaders: ["Content-Type", "Authorization"], // Cabeceras permitidas
});

// Exportar el middleware
module.exports = corsMiddleware;