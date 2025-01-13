"user strict";

console.log("Rutas de usuarios cargadas correctamente");

// Importar dependencias
import { Router } from "express";
import userController from "../controllers/userController.js";

import { authenticateUser } from "../middlewares/authMiddleware.js";

const router = Router(); // Crear una instancia del router de Express

// ------------------------- RUTAS DE USUARIOS -------------------------

// Ruta de registro de usuarios
router.post("/register", userController.registerUser);

//Ruta de login de usuarios
router.post("/login", userController.loginUser);

//Ruta recuperacion de contraseña
router.post("/password-recovery", userController.passwordRecovery);

//Ruta cambio de contraseña
router.post("/change-password", (req, res) => {
  console.log("Ruta /change-password alcanzada");
  userController.changePassword(req, res);
});

router.get("/protected", authenticateUser, (req, res) => {
  res.status(200).json({
    message: "Ruta protegida accedida con éxito",
    user: req.user, // Información del usuario autenticado
  });
});

//Ruta para actualizar perfil de usuario
router.patch("/:id/profile", userController.updateUserProfile);

// ------------------------- EXPORTAR RUTAS -------------------------
export default router;
