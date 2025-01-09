"user strict";

console.log("Rutas de usuarios cargadas correctamente");

// Importar dependencias
const express = require("express");
const {
  registerUser,
  loginUser,
  passwordRecovery,
  changePassword,
  updateUserProfile,
} = require("../controllers/userController");
const { authenticateUser } = require("../middlewares/authMiddleware.js");

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

router.get("/protected", authenticateUser, (req, res) => {
  res.status(200).json({
    message: "Ruta protegida accedida con éxito",
    user: req.user, // Información del usuario autenticado
  });
});

//Ruta para actualizar perfil de usuario
router.patch("/:id/profile", updateUserProfile);

// ------------------------- EXPORTAR RUTAS -------------------------
module.exports = router;
