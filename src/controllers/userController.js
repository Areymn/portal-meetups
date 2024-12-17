"use strict";

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Joi = require("joi");

//contraseña
const nodemailer = require("nodemailer");
const crypto = require("crypto");

//LOGIN
const JWT_SECRET = process.env.JWT_SECRET || "secret_key"; // Clave secreta para el token

//Base de datos simulada
const users = [];

// Crear un usuario temporal con contraseña encriptada
(async () => {
  const hashedPassword = await bcrypt.hash("123456", 10); // Contraseña temporal: 123456
  users.push({
    email: "test@example.com",
    username: "testuser",
    password: hashedPassword,
  });
  console.log("Usuario temporal creado:", users);
})();

//Controlador para registrar usarios
const registerUser = async (req, res) => {
  try {
    console.log("Solicitud recibida:", req.body);

    //Validar los datos del body
    const schema = Joi.object({
      email: Joi.string().email().required(),
      username: Joi.string().min(3).max(30).required(),
      password: Joi.string().min(6).required(),
    });

    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { email, username, password } = req.body;

    //Verificar si el usuario ya existe
    const userExists = users.find((user) => user.email === email);
    if (userExists) {
      return res.status(400).json({ error: "El email ya esta registrado." });
    }

    //Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    //Guardar el usuario en la base de datos
    const newUser = { email, username, password: hashedPassword };
    users.push(newUser);

    //Responder con éxito
    res.status(201).json({ message: "Usuario registrado con éxito." });
  } catch (err) {
    console.error("Error en el controlador:", err.message);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

module.exports = { registerUser };

// Controlador para el login de usuarios
const loginUser = async (req, res) => {
  // Validar los datos del body
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const { email, password } = req.body;

  // Buscar el usuario en la base de datos
  const user = users.find((u) => u.email === email);
  if (!user) {
    return res.status(400).json({ error: "El usuario no existe." });
  }

  // Verificar la contraseña
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({ error: "Contraseña incorrecta." });
  }

  // Generar un token JWT
  const token = jwt.sign(
    { email: user.email, username: user.username },
    JWT_SECRET,
    { expiresIn: "1h" } // El token expira en 1 hora
  );

  // Responder con el token
  res.status(200).json({ message: "Login exitoso", token });
};

module.exports = { registerUser, loginUser };

// ENDPOINT CAMBIO CONTRASEÑA

// Base de datos simulada
const recoveryCodes = {}; // Guardar los códigos de recuperación temporalmente

// Función para recuperación de contraseña
const passwordRecovery = async (req, res) => {
  // Código existente de recuperación de contraseña
  const schema = Joi.object({
    email: Joi.string().email().required(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const { email } = req.body;

  // Verificar si el usuario existe
  const user = users.find((u) => u.email === email);
  if (!user) {
    return res.status(404).json({ error: "El email no está registrado." });
  }

  // Generar un código único
  const recoveryCode = crypto.randomBytes(20).toString("hex");
  recoveryCodes[email] = recoveryCode;
  console.log("Código generado:", recoveryCode); // Log para confirmar

  // Enviar correo (simulado)
  console.log(`Código de recuperación para ${email}: ${recoveryCode}`);

  res
    .status(200)
    .json({ message: "Código de recuperación enviado por correo." });
};

// Función para cambiar la contraseña
const changePassword = async (req, res) => {
  try {
    console.log("Body recibido:", req.body); // Log para depurar
    console.log("Códigos actuales:", recoveryCodes); // Ver los códigos generados

    const schema = Joi.object({
      email: Joi.string().email().required(),
      recoveryCode: Joi.string().required(),
      newPassword: Joi.string().min(6).required(),
    });

    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { email, recoveryCode, newPassword } = req.body;

    //Verificar si el usuario existe
    const user = users.find((u) => u.email === email);
    if (!user) {
      return res.status(404).json({ error: "El usuario no existe." });
    }

    console.log("Código recibido:", recoveryCode);
    console.log("Código esperado:", recoveryCodes[email]);

    //Validar el codigo de recuperacion
    if (!recoveryCodes[email] || recoveryCodes[email] !== recoveryCode) {
      return res
        .status(400)
        .json({ error: "Código de recuperación inválido." });
    }

    // Encriptar la nueva contraseña
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    // Eliminar el código usado
    delete recoveryCodes[email];

    res.status(200).json({ message: "Contraseña actualizada correctamente." });
  } catch (err) {
    console.error("Error en changePassword:", err.message);
    res.status(500).json({ error: "Error interno del servidor." });
  }
};

// Exportar las funciones
module.exports = {
  registerUser,
  loginUser,
  passwordRecovery,
  changePassword,
};
