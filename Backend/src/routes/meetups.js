"use strict";

// Console para depuración
console.log("Rutas de meetups cargadas correctamente");

// Importar dependencias
import { Router } from "express";
import { createEvents } from "../controllers/meetups/createEvent.js";
import {
  detailEvent,
  getCities,
  getThemes,
} from "../controllers/meetups/detailEvent.js"; // Agregamos getThemes
import { getEvents } from "../controllers/meetups/sortEvent.js";
import { signupEvent } from "../controllers/meetups/signupEvent.js";
import { editEvent } from "../controllers/meetups/editEvent.js";
import { validateEvent } from "../controllers/meetups/validateEvent.js";
import { authenticateAdmin } from "../middlewares/authAdmin.js";
import { authenticateUser } from "../middlewares/authMiddleware.js";
import { rateEvent } from "../controllers/meetups/rateEvent.js";

// Crear una instancia del router de Express
const router = Router();

// ------------------------- RUTAS DE MEETUPS -------------------------

// Ruta para crear un evento
router.post("/", authenticateUser, createEvents);

// Ruta para obtener los detalles de un evento
router.get("/:id/detail", authenticateUser, detailEvent);

// Ruta para editar un evento
router.put("/edit/:id", authenticateUser, editEvent);

// Ruta para inscribirse en un evento
router.post("/signup", authenticateUser, signupEvent);

// Ruta para que el administrador valide eventos
router.post("/admin/validate", authenticateAdmin, validateEvent);

// Ruta para obtener ciudades
router.get("/cities", getCities);

// Ruta para obtener temáticas
router.get("/themes", getThemes);

// Ruta para obtener y ordenar eventos
router.get("/", getEvents);

// Ruta para valorar un evento
router.post(
  "/:id/rate",
  authenticateUser,
  (req, res, next) => {
    console.log(`Endpoint /rate llamado para el evento ID: ${req.params.id}`);
    next();
  },
  rateEvent
);

// ------------------------- EXPORTAR RUTAS -------------------------
export default router;
