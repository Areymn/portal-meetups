"user strict";

const express = require("express");
const { registerUser } = require("../controllers/userController");
const router = express.Router();

// Ruta de registro de usuarios
router.post("/register", registerUser);

module.exports = router;
//////////////////////////

const { loginUser } = require("../controllers/userController");

//Ruta de login de usuarios
router.post("/login", loginUser);
