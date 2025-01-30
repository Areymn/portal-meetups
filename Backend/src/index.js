"use strict";

// Cargar variables de entorno desde el archivo .env
import dotenv from "dotenv";
dotenv.config();

import express, { json } from "express"; // Framework de servidor web
import { PORT } from "./env.js"; // Obtenemos las variables de entorno
import initDB from "./db/initDB.js";
import bodyParser from "body-parser"; // Middleware para parsear cuerpos JSON
import cors from "cors"; // Middleware para permitir solicitudes de otros dominios
import path from "path"; // Módulo para manejar rutas de archivos
import userRoutes from "./routes/userRoutes.js"; // Importar rutas de usuarios
import meetups from "./routes/meetups.js"; // Importa las rutas de los meetups
import { logger } from "./middlewares/logger.js";

// ------------------------- INICIALIZAR APP -------------------------

const app = express(); // Crear una instancia de la aplicación Express

app.use((req, res, next) => {
  console.log(`📡 Nueva solicitud recibida: ${req.method} ${req.url}`);
  console.log("📜 Headers de la solicitud:", req.headers);
  console.log("📦 Cuerpo de la solicitud:", req.body);
  next();
});

// ------------------------- MIDDLEWARES BÁSICOS -------------------------
app.use(logger); //Archivos estaticos

app.use(json()); // Parsear JSON en el body de las solicitudes

// Configurar CORS para permitir solicitudes desde cualquier origen
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
); // Permite todas las solicitudes (puedes restringirlo a dominios específicos)
//     methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"], // Métodos HTTP permitidos
//     allowedHeaders: ["Content-Type", "Authorization"], // Headers permitidas
//   })
// );

// Middleware para servir archivos estaticos

app.use(express.static("src/uploads"));

// ------------------------- RUTAS -------------------------
// import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// Intenta resolver la ruta del archivo `events.js`
console.log("Probando ruta hacia events.js...");
try {
  const resolvedPath = path.resolve(__dirname, "./db/events.js");
  console.log("Ruta resuelta:", resolvedPath);
} catch (error) {
  console.error("Error al resolver ruta:", error);
}

// Rutas de usuarios (todas las rutas que empiezan con /api/users)
app.use("/api/users", userRoutes);

//Rutas base, de prueba para ver que el servidor funcione
app.get("/", (req, res) => {
  res.send("Servidor funcionando correctamente.");
});

// Ruta que accede a los controladores de los meetups
app.use("/api/meetups", meetups);

// Imprime todas las rutas registradas
app._router.stack.forEach((layer) => {
  if (layer.route) {
    console.log(layer.route.path);
  }
});
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
// const PORT = process.env.PORT || 5000;// NO REDECLARAR PORQUE YA LO IMPORTA .env.js de .env

initDB(); // Asegura que la base de datos está lista antes de aceptar solicitudes.

// Iniciar el servidor en el puerto especificado
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
