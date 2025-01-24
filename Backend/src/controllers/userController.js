"use strict";

import bcryptjs from "bcryptjs"; // Para encriptar y comparar contraseñas
import jwt from "jsonwebtoken"; // Para generar y verificar tokens JWT
import Joi from "joi"; // Para validar los datos recibidos
import nodemailer from "nodemailer"; // Para enviar correos (simulado)
import { randomBytes } from "crypto"; // Para generar códigos únicos (recuperación de contraseña)
import { v4 as uuidv4 } from "uuid"; // Importar la función para generar IDs únicos
import getPool from "../db/getPool.js";
import crypto from "crypto"; // Para generar códigos únicos

import { addMinutes, format } from "date-fns";

//Clave secreta para JWT, tomada de variables de entorno (log in)
const JWT_SECRET = process.env.JWT_SECRET || "secret_key"; // Clave secreta para el token

// Base de datos simulada (temporal, mientras no se use una base de datos real)
const users = [];

// Almacén temporal de códigos de recuperación
const recoveryCodes = {};

const { hash, compare } = bcryptjs;

const { object, string } = Joi;

const { sign, verify } = jwt;

const timeZone = "Europe/Madrid"; // Ajusta a la zona horaria que necesitas

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
    const schema = Joi.object({
      username: Joi.string().min(3).max(30).required(),
      email: Joi.string().email().required(),
      password: Joi.string().min(6).required(),
      name: Joi.string().required(),
      last_name: Joi.string().required(),
      avatar: Joi.string(), // Opcional
      rol: Joi.string().valid("admin", "user").default("user"),
    });

    const validationResult = schema.validate(req.body);
    if (validationResult.error) {
      return res
        .status(400)
        .json({ error: validationResult.error.details[0].message });
    }

    const { email, username, password, name, last_name, avatar, rol } =
      validationResult.value;

    // //Verificar si el usuario ya existe
    // const userExists = users.find((user) => user.email === email);
    // if (userExists) {
    //   return res.status(400).json({ error: "El email ya esta registrado." });
    // }

    const pool = await getPool();
    // Verificar si el usuario ya existe
    const [existingUser] = await pool.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );
    if (existingUser.length > 0) {
      return res.status(400).json({ error: "El email ya está registrado." });
    }

    //Encriptar la contraseña antes de guardarla
    const hashedPassword = await hash(password, 10);
    // //Guardar el usuario en la base de datos simulada
    // const newUser = { email, username, password: hashedPassword };
    // users.push(newUser);

    // Insertar el nuevo usuario en la base de datos
    await pool.query(
      "INSERT INTO users (username, email, password, name, last_name, avatar, rol) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [username, email, hashedPassword, name, last_name, avatar, rol]
    );
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
    const schema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().min(6).required(),
    });

    const { error, value } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { email, password } = value;
    const pool = await getPool();
    // // Buscar el usuario en la base de datos simulada
    // const user = users.find((u) => u.email === email);
    // if (!user) {
    //   return res.status(400).json({ error: "El usuario no existe." });
    // }
    const [users] = await pool.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    if (users.length === 0) {
      return res.status(400).json({ error: "El usuario no existe." });
    }
    const user = users[0];
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
    res.status(200).json({
      message: "Login exitoso",
      token,
      username: user.username, // Incluye el nombre de usuario
    });
  } catch (err) {
    console.error("Error en loginUser:", err.message);
    res.status(500).json({ error: "Error interno del servidor." });
  }
};

// -------------- GENERAR CODIGO DE VALIDACION DE USUARIOS ---------------

export const generateValidationCode = async (req, res) => {
  const { email } = req.body;

  try {
    const pool = await getPool();

    // Verificar si el usuario existe
    const [users] = await pool.query("SELECT id FROM users WHERE email = ?", [
      email,
    ]);

    if (users.length === 0) {
      return res.status(404).json({ error: "Usuario no encontrado." });
    }

    const userId = users[0].id;

    // Generar un código único
    const code = crypto.randomBytes(3).toString("hex").toUpperCase();

    // Obtener la hora actual de MySQL y calcular la expiración
    const [result] = await pool.query("SELECT NOW() as now");
    const currentMySQLTime = result[0].now;

    // Añadir minutos para la expiración
    const expiresAt = addMinutes(new Date(currentMySQLTime), 15);
    const formattedExpiresAt = format(expiresAt, "yyyy-MM-dd HH:mm:ss");
    console.log(`Fecha de expiración formateada: ${formattedExpiresAt}`);

    console.log(
      `Código generado: ${code}, para usuario: ${email}, expira: ${formattedExpiresAt}`
    );

    // Insertar el código en la tabla `user_validation`
    await pool.query(
      "INSERT INTO user_validation (user_id, validation_code, expires_at) VALUES (?, ?, ?)",
      [userId, code, formattedExpiresAt]
    );

    console.log(`Código de validación para ${email}: ${code}`);
    res
      .status(200)
      .json({ message: "Código de validación generado y enviado." });
  } catch (error) {
    console.error("Error al generar el código de validación:", error.message);
    res.status(500).json({ error: "Error interno del servidor." });
  }
};

//-------------------------- VALIDACION DEL CODIGO------------------------

export const validateUserCode = async (req, res) => {
  const { email, code } = req.body;

  try {
    const pool = await getPool();

    // Verificar si el código es válido
    const [validationData] = await pool.query(
      `SELECT uv.id FROM user_validation uv
       JOIN users u ON uv.user_id = u.id
       WHERE u.email = ? AND uv.validation_code = ? AND uv.expires_at > NOW()`,
      [email, code]
    );

    if (validationData.length === 0) {
      console.log(
        `Fallido: El código ${code} para ${email} es incorrecto o ha expirado.`
      );
      return res
        .status(400)
        .json({ error: "Código de validación incorrecto o expirado." });
    }

    // Detalles adicionales sobre la validación exitosa
    console.log(
      `Exitoso: El código ${code} para ${email} es válido. Expira tras el uso`
    );

    // Eliminar el código usado
    await pool.query("DELETE FROM user_validation WHERE id = ?", [
      validationData[0].id,
      console.log("Codigo de validacion eliminado tras haber sido usado"),
    ]);

    res.status(200).json({ message: "Usuario validado con éxito." });
  } catch (error) {
    console.error("Error al validar el código:", error.message);
    res.status(500).json({ error: "Error interno del servidor." });
  }
};

// ------------------------- CAMBIO DE CONTRASEÑA -------------------------

/**
 * Genera un código de recuperación de contraseña y lo "envía" por correo.
 */

// Función para recuperación de contraseña
const passwordRecovery = async (req, res) => {
  // const { object, string } = Joi;
  // Código existente de recuperación de contraseña
  const schema = Joi.object({
    email: Joi.string().email().required(),
  });

  const { error, value } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const { email } = value;
  const pool = await getPool();

  // Verificar si el usuario existe
  const [users] = await pool.query("SELECT id FROM users WHERE email = ?", [
    email,
  ]);

  if (users.length === 0) {
    return res.status(404).json({ error: "El email no está registrado." });
  }

  const userId = users[0].id;
  // Generar y guarda un código único
  const recoveryCode = randomBytes(20).toString("hex");
  await pool.query(
    "INSERT INTO password_recovery (user_id, recovery_code, expires_at) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 1 HOUR))",
    [userId, recoveryCode]
  );

  console.log("Código generado:", recoveryCode); // Log para confirmar

  //Logica para enviar correos.
  // Crear una cuenta de prueba Ethereal automáticamente y enviar el correo
  let testAccount = await nodemailer.createTestAccount();

  let transporter = nodemailer.createTransport({
    host: testAccount.smtp.host,
    port: testAccount.smtp.port,
    secure: testAccount.smtp.secure,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });

  const mailOptions = {
    from: '"Soporte Técnico" <support@example.com>', // dirección del remitente
    to: email, // lista de destinatarios
    subject: "Código de Recuperación de Contraseña", // Línea de asunto
    text: `Tu código de recuperación es: ${recoveryCode}`, // cuerpo del texto plano
    html: `<b>Tu código de recuperación es:</b> ${recoveryCode}`, // cuerpo del HTML
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
      return res.status(500).json({ error: "Error al enviar el correo." });
    } else {
      console.log("Correo enviado: " + nodemailer.getTestMessageUrl(info));
      res.status(200).json({
        message: "Código de recuperación enviado por correo.",
        previewUrl: nodemailer.getTestMessageUrl(info),
      });
    }
  });
};

// ------------------------- CAMBIO DE CONTRASEÑA -------------------------
/**
 * Cambia la contraseña de un usuario utilizando un código de recuperación.
 */

// Función para cambiar la contraseña
const changePassword = async (req, res) => {
  try {
    console.log("Body recibido:", req.body); // Log para depurar

    const schema = Joi.object({
      email: Joi.string().email().required(),
      recoveryCode: Joi.string().required(),
      newPassword: Joi.string().min(6).required(),
    });

    const { error, value } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { email, recoveryCode, newPassword } = value;
    const pool = await getPool();
    // Modificada la consulta para hacer JOIN con la tabla users
    const [records] = await pool.query(
      `SELECT pr.user_id FROM password_recovery pr
      JOIN users u ON pr.user_id = u.id
      WHERE u.email = ? AND pr.recovery_code = ? AND pr.expires_at > NOW()`,
      [email, recoveryCode]
    );

    if (records.length === 0) {
      return res
        .status(400)
        .json({ error: "Código de recuperación inválido o expirado." });
    }

    // Encriptar y actualizar la nueva contraseña
    const hashedPassword = await bcryptjs.hash(newPassword, 10);
    await pool.query("UPDATE users SET password = ? WHERE id = ?", [
      hashedPassword,
      records[0].user_id,
    ]);

    // Eliminar el código de recuperación usado
    await pool.query("DELETE FROM password_recovery WHERE recovery_code = ?", [
      recoveryCode,
    ]);

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
