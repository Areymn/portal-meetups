'user strict';

const { isAdmin } = require('../db/events.js');

console.log('Rutas de meetups cargadas correctamente');

// Importar dependencias
const express = import('express');
const { createEvent } = import('../controllers/meetups/createEvent');
const { detailEvent } = import('../controllers/meetups/detailEvent');
const { getEvents } = import('../controllers/meetups/sortEvent');
const { signupEvent } = import('../controllers/meetups/signupEvent');
const { editEvent } = import('../controllers/meetups/editEvent');
const { validateEvent } = import('../controllers/meetups/validateEvent');
const { authenticateAdmin } = import('../middlewares/authAdmin.js');
const { authenticateUser } = import('../middlewares/authMiddleware.js');
const router = express.Router(); // Crear una instancia del router de Express

// ------------------------- RUTAS DE MEETUPS -------------------------

// Rutas de meetups
router.post('/admin/validate', authenticateAdmin, validateEvent);

router.post('/create', authenticateUser, createEvent);

router.post('/signup', authenticateUser, signupEvent);

router.post('/detail', detailEvent);

router.post('/edit', editEvent);

router.post('/', getEvents);

// ------------------------- EXPORTAR RUTAS -------------------------
module.exports = router;
