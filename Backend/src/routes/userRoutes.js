"user strict";

console.log("Rutas de usuarios cargadas correctamente");

// Importar dependencias
const express = require("express");
const {
  registerUser,
  loginUser,
  passwordRecovery,
  changePassword,
} = require("../controllers/userController");

const router = express.Router(); // Crear una instancia del router de Express

// ------------------------- RUTAS DE USUARIOS -------------------------

// Ruta de registro de usuarios
router.post("/register", registerUser);

//Ruta de login de usuarios
router.post("/login", loginUser);

//Ruta recuperacion de contraseña
router.post("/password-recovery", passwordRecovery);

//Ruta cambio de contraseña
router.post("/change-password", (req, res) => {
  console.log("Ruta /change-password alcanzada");
  changePassword(req, res);
});

// ------------------------- EXPORTAR RUTAS -------------------------
module.exports = router;
