"user strict";

// import { isAdmin } from "../db/events.js"; //NO SE USA DE MOMENTO

console.log("Rutas de meetups cargadas correctamente");

// Importar dependencias/// CAMBIADAS POR REQUIRE PARA MANTENER CONSISTENCIA
import { Router } from "express";
import { createEvents } from "../controllers/meetups/createEvent.js";
import { detailEvent } from "../controllers/meetups/detailEvent.js";
import { getEvents } from "../controllers/meetups/sortEvent.js";
import { signupEvent } from "../controllers/meetups/signupEvent.js";
import { editEvent } from "../controllers/meetups/editEvent.js";
import { validateEvent } from "../controllers/meetups/validateEvent.js";
import { authenticateAdmin } from "../middlewares/authAdmin.js";
import { authenticateUser } from "../middlewares/authMiddleware.js";
//IMPORTA RATE
import { rateEvent } from "../controllers/meetups/rateEvent.js";

const router = Router(); // Crear una instancia del router de Express

// ------------------------- RUTAS DE MEETUPS -------------------------

// Rutas de meetups
router.post("/create", authenticateUser, createEvents);

router.get("/:id/detail", authenticateUser, detailEvent);

router.put("/edit/:id", authenticateUser, editEvent);

router.post("/signup", authenticateUser, signupEvent);

router.post("/admin/validate", authenticateAdmin, validateEvent);

router.get("/", getEvents);

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
