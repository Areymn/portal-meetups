'user strict';

console.log('Rutas de meetups cargadas correctamente');

// Importar dependencias
const express = import('express');
const { createEvent } = import('../controllers/meetups/createEvent');
const { detailEvent } = import('../controllers/meetups/detailEvent');
const { sortEvent } = import('../controllers/meetups/sortEvent');
const { signupEvent } = import('../controllers/meetups/signupEvent');
const { authenticateUser } = import('../middlewares/authMiddleware.js');
const router = express.Router(); // Crear una instancia del router de Express

// ------------------------- RUTAS DE MEETUPS -------------------------

// Rutas de meetups

router.post('/create', authenticateUser, createEvent);

router.post('/signup', authenticateUser, signupEvent);

router.post('/detail', detailEvent);

router.post('/', sortEvent);

// ------------------------- EXPORTAR RUTAS -------------------------
module.exports = router;
