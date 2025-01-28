"use strict";

import cors from "cors"; // Importar la librería cors

// Middleware para permitir solicitudes CORS
const corsMiddleware = cors({
  origin: "*", // Permite todas las solicitudes (puedes restringirlo a dominios específicos)
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"], // Métodos HTTP permitidos
  allowedHeaders: ["Content-Type", "Authorization"], // Cabeceras permitidas
});

// Exportar el middleware
export default corsMiddleware;
