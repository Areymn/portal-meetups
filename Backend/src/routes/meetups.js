"user strict";

const { isAdmin } = require("../db/events.js"); //NO SE USA DE MOMENTO

console.log("Rutas de meetups cargadas correctamente");

// Importar dependencias/// CAMBIADAS POR REQUIRE PARA MANTENER CONSISTENCIA
const express = require("express");
const { createEvents } = require("../controllers/meetups/createEvent");
const { detailEvent } = require("../controllers/meetups/detailEvent");
const { getEvents } = require("../controllers/meetups/sortEvent");
const { signupEvent } = require("../controllers/meetups/signupEvent");
const { editEvent } = require("../controllers/meetups/editEvent");
const { validateEvent } = require("../controllers/meetups/validateEvent");
const { authenticateAdmin } = require("../middlewares/authAdmin.js");
const { authenticateUser } = require("../middlewares/authMiddleware.js");
//IMPORTA RATE
const { rateEvent } = require("../controllers/meetups/rateEvent");

const router = express.Router(); // Crear una instancia del router de Express

// ------------------------- RUTAS DE MEETUPS -------------------------

// Rutas de meetups// CAMBIADAS LETRAS PORQUE DABA ERROR POR CITAR BIEN LAS PALABRAS
router.post("/create", authenticateUser, createEvents);

router.post("/detail", detailEvent);

router.post("/edit", editEvent);

router.post("/signup", authenticateUser, signupEvent);

router.post("/admin/validate", authenticateAdmin, validateEvent);

router.get("/", getEvents);

//ENDPOINT PARA AÑADIR RATING Y COMENTARIO
router.post("/:id/rate", rateEvent);

// ------------------------- EXPORTAR RUTAS -------------------------
module.exports = router;
