"use strict";

// Cargar variables de entorno desde el archivo .env
require("dotenv").config();

const express = require("express"); // Framework de servidor web
const bodyParser = require("body-parser"); // Middleware para parsear cuerpos JSON
const cors = require("cors"); // Middleware para permitir solicitudes de otros dominios
const path = require("path"); // Módulo para manejar rutas de archivos
const userRoutes = require("./routes/userRoutes"); // Importar rutas de usuarios
const meetups = require("./routes/meetups"); // Importa las rutas de los meetups

// ------------------------- INICIALIZAR APP -------------------------

const app = express(); // Crear una instancia de la aplicación Express

// ------------------------- MIDDLEWARES BÁSICOS -------------------------

app.use(express.json()); // Parsear JSON en el body de las solicitudes

// Configurar CORS para permitir solicitudes desde cualquier origen
app.use(
  cors({
    origin: "*", // Permite todas las solicitudes (puedes restringirlo a dominios específicos)
    methods: ["GET", "POST", "PUT", "DELETE"], // Métodos HTTP permitidos
    allowedHeaders: ["Content-Type", "Authorization"], // Cabeceras permitidas
  })
);

// ------------------------- RUTAS -------------------------

// Rutas de usuarios (todas las rutas que empiezan con /api/users)
app.use("/api/users", userRoutes);

//Rutas base, de prueba para ver que el servidor funcione
app.get("/", (req, res) => {
  res.send("Servidor funcionando correctamente.");
});

// Ruta que accede a los controladores de los meetups
app.use("/api/meetups", meetups);

// ------------------------- MANEJO DE ERRORES -------------------------

//Middleware para manejar rutas no encontradas, 404
app.use((req, res, next) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});

// Middleware para manejar errores generales del servidor, 500
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Error interno del servidor" });
});

// ------------------------- CONFIGURAR PUERTO Y LEVANTAR SERVIDOR -------------------------

// Obtener el puerto desde variables de entorno o usar 5000 por defecto
const PORT = process.env.PORT || 5000;

// Iniciar el servidor en el puerto especificado
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
