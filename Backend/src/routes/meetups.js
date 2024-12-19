'user strict';

console.log('Rutas de meetups cargadas correctamente');

// Importar dependencias
const express = require('express');
const { createEvent } = require('../controllers/meetups/createEvent');
const { detailEvent } = require('../controllers/meetups/detailEvent');
const { sortEvent } = require('../controllers/meetups/sortEvent');
const { signupEvent } = require('../controllers/meetups/signupEvent');
const { authenticateUser } = require('../middlewares/authMiddleware.js');
const router = express.Router(); // Crear una instancia del router de Express

// ------------------------- RUTAS DE USUARIOS -------------------------

// Ruta de registro de usuarios
router.post('/create', createEventregisterUser);

router.post('/');

// ------------------------- EXPORTAR RUTAS -------------------------
module.exports = router;