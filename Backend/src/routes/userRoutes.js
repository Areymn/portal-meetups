"user strict";

console.log("Rutas de usuarios cargadas correctamente");

// Importar dependencias
import { Router } from "express";
import userController from "../controllers/userController.js";

import { authenticateUser } from "../middlewares/authMiddleware.js";

import {
  generateValidationCode,
  validateUserCode,
} from "../controllers/userController.js";

import upload from "../middlewares/uploadMiddleware.js";

const router = Router(); // Crear una instancia del router de Express

// ------------------------- RUTAS DE USUARIOS -------------------------

// Ruta de registro de usuarios
router.post("/register", userController.registerUser);

//Ruta de login de usuarios
router.post("/login", userController.loginUser);

// Ruta para generar el código de validación
router.post("/generate-validation-code", generateValidationCode);

// Ruta para validar el código de validación
router.post("/validate-user-code", validateUserCode);

//Ruta recuperacion de contraseña
router.post("/password-recovery", userController.passwordRecovery);

// Ruta para cambiar contraseña con el token de recuperación
router.post("/reset-password", userController.resetPassword);

router.post(
  "/password-reset-notification",
  userController.sendPasswordResetNotification
);

// Ruta cambio de contraseña con autenticación
router.post(
  "/change-password",
  authenticateUser,
  (req, res, next) => {
    console.log("Ruta /change-password alcanzada");
    next(); // Pasar al siguiente middleware, que es el controlador de cambio de contraseña
  },
  userController.changePassword
);

// Ruta protegida (para probar autenticación)
router.get("/protected", authenticateUser, (req, res) => {
  res.status(200).json({
    message: "Ruta protegida accedida con éxito",
    user: req.user, // Información del usuario autenticado
  });
});

// Ruta para actualizar perfil de usuario con autenticación
router.patch(
  "/:id/profile",
  authenticateUser,
  userController.updateUserProfile
);

// Ruta para subir una foto de perfil con autenticación
router.post(
  "/profile/upload",
  authenticateUser,
  upload.single("photo"),
  (req, res) => {
    if (req.file) {
      res.send(`Foto subida con éxito: ${req.file.path}`);
    } else {
      res.status(400).send("No se subió ningún archivo.");
    }
  }
);

// ------------------------- EXPORTAR RUTAS -------------------------
export default router;
