"use strict";

require("dotenv").config(); // carga variables entorno
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");

// Inicializamos la aplicación Express
const app = express();

//Middlewares basicos
app.use(express.json()); // Parsear JSON en el body de las solicitudes

const path = require("path");
app.use("/static", express.static(path.join(__dirname, "public"))); // Estaticos

app.use(
  cors({
    origin: "*", // Permite todas las solicitudes (puedes restringirlo a dominios específicos)
    methods: ["GET", "POST", "PUT", "DELETE"], // Métodos permitidos
    allowedHeaders: ["Content-Type", "Authorization"], // Cabeceras permitidas
  })
); // Permitir peticiones desde otros dominios

// Rutas de usuarios
app.use("/api/users", userRoutes);

//Rutas base, de prueba para ver que el servidor funcione

app.get("/", (req, res) => {
  res.send("Servidor funcionando correctamente.");
});

//Errores 404
app.use((req, res, next) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});

//Middleware de manejo de errores generales
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Error interno del servidor" });
});

//Puerto
const PORT = process.env.PORT || 5000;
console.log(`Vlor del puerto: ${PORT}`);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
