"use strict";

import bcryptjs from "bcryptjs"; // Para encriptar y comparar contraseñas
import jwt from "jsonwebtoken"; // Para generar y verificar tokens JWT
import Joi from "joi"; // Para validar los datos recibidos
import nodemailer from "nodemailer"; // Para enviar correos (simulado)
import { randomBytes } from "crypto"; // Para generar códigos únicos (recuperación de contraseña)
import { v4 as uuidv4 } from "uuid"; // Importar la función para generar IDs únicos

//Clave secreta para JWT, tomada de variables de entorno (log in)
const JWT_SECRET = process.env.JWT_SECRET || "secret_key"; // Clave secreta para el token

// Base de datos simulada (temporal, mientras no se use una base de datos real)
const users = [];

// Almacén temporal de códigos de recuperación
const recoveryCodes = {}; // Guardar los códigos de recuperación temporalmente

const { hash, compare } = bcryptjs;

const { object, string } = Joi;

const { sign, verify } = jwt;

// ------------------------- CREAR USUARIO TEMPORAL -------------------------

(async () => {
  // Creacion de un usuario temporal con contraseña encriptada
  const hashedPassword = await hash("123456", 10); // Contraseña temporal: 123456
  users.push({
    id: uuidv4(), // Genera un ID único
    email: "test@example.com",
    username: "testuser",
    password: hashedPassword,
  });
  console.log("Usuario temporal creado:", users);
})();

// ------------------------- REGISTRO DE USUARIOS -------------------------

/**
 * Controlador para registrar usuarios.
 * Valida los datos de entrada, encripta la contraseña y guarda el usuario.
 */

const registerUser = async (req, res) => {
  try {
    console.log("Solicitud recibida:", req.body); // Log para depuración

    // Validar los datos del body con Joi
    const schema = object({
      email: string().email().required(),
      username: string().min(3).max(30).required(),
      password: string().min(6).required(),
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

    //Encriptar la contraseña antes de guardarla
    const hashedPassword = await hash(password, 10);

    //Guardar el usuario en la base de datos simulada
    const newUser = { email, username, password: hashedPassword };
    users.push(newUser);

    //Responder con éxito
    res.status(201).json({ message: "Usuario registrado con éxito." });
  } catch (err) {
    console.error("Error en el controlador:", err.message);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// ------------------------- LOGIN DE USUARIOS -------------------------

/**
 * Controlador para el login de usuarios.
 * Valida credenciales, compara contraseñas y genera un token JWT.
 */

// Controlador para el login de usuarios
const loginUser = async (req, res) => {
  try {
    // Validar los datos del body
    const schema = object({
      email: string().email().required(),
      password: string().min(6).required(),
    });

    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { email, password } = req.body;

    // Buscar el usuario en la base de datos simulada
    const user = users.find((u) => u.email === email);
    if (!user) {
      return res.status(400).json({ error: "El usuario no existe." });
    }

    // Verificar la contraseña encriptada
    const isPasswordValid = await compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Contraseña incorrecta." });
    }

    // Generar un token JWT con una expiracion de 1 hora
    const token = sign(
      { email: user.email, username: user.username },
      JWT_SECRET,
      { expiresIn: "1h" } // El token expira en 1 hora
    );

    // Responder con el token
    res.status(200).json({ message: "Login exitoso", token });
  } catch (err) {
    console.error("Error en loginUser:", err.message);
    res.status(500).json({ error: "Error interno del servidor." });
  }
};

// ------------------------- CAMBIO DE CONTRASEÑA -------------------------

/**
 * Genera un código de recuperación de contraseña y lo "envía" por correo.
 */

// Función para recuperación de contraseña
const passwordRecovery = async (req, res) => {
  // Código existente de recuperación de contraseña
  const schema = object({
    email: string().email().required(),
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

  // Generar y guarda un código único
  const recoveryCode = randomBytes(20).toString("hex");
  recoveryCodes[email] = recoveryCode;
  console.log("Código generado:", recoveryCode); // Log para confirmar

  // Enviar correo (simulado)
  console.log(`Código de recuperación para ${email}: ${recoveryCode}`);

  res
    .status(200)
    .json({ message: "Código de recuperación enviado por correo." });
};

// ------------------------- CAMBIO DE CONTRASEÑA -------------------------
/**
 * Cambia la contraseña de un usuario utilizando un código de recuperación.
 */

// Función para cambiar la contraseña
const changePassword = async (req, res) => {
  try {
    console.log("Body recibido:", req.body); // Log para depurar
    console.log("Códigos actuales:", recoveryCodes); // Ver los códigos generados

    const schema = object({
      email: string().email().required(),
      recoveryCode: string().required(),
      newPassword: string().min(6).required(),
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

    // Encriptar y actualizar la nueva contraseña
    const hashedPassword = await hash(newPassword, 10);
    user.password = hashedPassword;

    // Eliminar el código de recuperación usado
    delete recoveryCodes[email];

    res.status(200).json({ message: "Contraseña actualizada correctamente." });
  } catch (err) {
    console.error("Error en changePassword:", err.message);
    res.status(500).json({ error: "Error interno del servidor." });
  }
};

// ------------------------- ACTUALIZAR PERFIL DE USUARIO-------------------------

const updateUserProfile = async (req, res) => {
  try {
    const { id } = req.params; // Obtiene el ID desde los parámetros de la URL
    console.log("User ID:", id); // Para depuración

    const updates = req.body; // Datos enviados en el cuerpo de la solicitud
    console.log("Actualizaciones recibidas:", updates); // Verifica el cuerpo recibido

    console.log("Usuarios disponibles:", users);
    // Validar que el usuario existe
    const user = users.find((user) => user.id === id);
    console.log("User encontrado:", user); // Para verificar si el usuario existe
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Actualizar los campos permitidos
    Object.keys(updates).forEach((key) => {
      if (["name", "email", "bio"].includes(key)) {
        user[key] = updates[key];
      }
    });

    // Responder con el usuario actualizado
    res.status(200).json({ message: "Profile updated", user });
  } catch (error) {
    console.error("Error interno:", error); // Muestra el error completo en la consola
    res.status(500).json({
      message: "Internal server error",
      error: error.message || "Unknown error occurred",
    });
  }
};

// Exportar las funciones
export default {
  registerUser,
  loginUser,
  passwordRecovery,
  changePassword,
  updateUserProfile,
};
