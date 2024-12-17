"user strict";

console.log("Rutas de usuarios cargadas correctamente");
const express = require("express");
const { changePassword } = require("../controllers/userController");
const { registerUser } = require("../controllers/userController");
const router = express.Router();

const { passwordRecovery } = require("../controllers/userController");

// Ruta de registro de usuarios
router.post("/register", registerUser);

module.exports = router;
//////////////////////////

const { loginUser } = require("../controllers/userController");

//Ruta de login de usuarios
router.post("/login", loginUser);

//Ruta cambio de contraseña
// router.post("/password-change", changePassword);
router.post("/change-password", (req, res) => {
  console.log("Ruta /change-password alcanzada");
  changePassword(req, res);
});

module.exports = router;

//Ruta recuperacion de contraseña
router.post("/password-recovery", passwordRecovery);

module.exports = router;
