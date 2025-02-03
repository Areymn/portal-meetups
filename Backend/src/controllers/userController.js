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

// (async () => {
//   // Creacion de un usuario temporal con contraseña encriptada
//   const hashedPassword = await hash("123456", 10); // Contraseña temporal: 123456
//   users.push({
//     id: uuidv4(), // Genera un ID único
//     email: "test@example.com",
//     username: "testuser",
//     password: hashedPassword,
//   });
//   console.log("Usuario temporal creado:", users);
// })();

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

    await generateValidationCode({ body: { email } }, res);
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
    const [users] = await pool.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    if (users.length === 0) {
      return res.status(400).json({ error: "El usuario no existe." });
    }
    const user = users[0];

    const isPasswordValid = await compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Contraseña incorrecta." });
    }

    if (!user.is_active) {
      return res
        .status(403)
        .json({ error: "Tu cuenta aún no ha sido activada." });
    }

    const token = sign(
      { user_id: user.id, email: user.email, username: user.username },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Login exitoso",
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        name: user.name,
        last_name: user.last_name,
        avatar: user.avatar,
      },
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
    res;

    // Inicializar el transporter para el envío del correo
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
      from: '"Soporte Técnico" <support@example.com>',
      to: email,
      subject: "Código de Verificación de Usuario",
      text: `Tu código de validación es: ${code}. Este código expirará el ${formattedExpiresAt}.`,
      html: `<p>Tu código de validación es: <strong>${code}</strong>.</p><p>Este código expirará el <strong>${formattedExpiresAt}</strong>.</p>`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error al enviar el correo:", error);
        return res.status(500).json({ error: "Error al enviar el correo." }); // Asegúrate de que salga del flujo
      }
      console.log("Correo enviado: " + nodemailer.getTestMessageUrl(info));
      res
        .status(200)
        .json({ message: "Código de validación generado y enviado." }); // Solo responde aquí
    });
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

    // Marcar la cuenta del usuario como activa en la tabla users
    await pool.query("UPDATE users SET is_active = 1 WHERE email = ?", [email]);
    console.log(`Cuenta activada para el usuario con email: ${email}`);

    // Eliminar el código usado
    await pool.query("DELETE FROM user_validation WHERE id = ?", [
      validationData[0].id,
      console.log("Codigo de validacion eliminado tras haber sido usado"),
    ]);

    res
      .status(200)
      .json({ message: "Usuario validado y cuenta activada con éxito." });
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
  // Generar un token JWT con el ID del usuario
  const token = sign({ userId, email }, JWT_SECRET, { expiresIn: "1h" });

  const decodedToken = verify(token, JWT_SECRET);
  console.log("Contenido del token generado:", decodedToken);

  // Log para pruebas
  console.log("Token generado para recuperación de contraseña:", token);

  // Enviar el token por correo
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

  const resetLink = `http://localhost:5173/password-reset?token=${token}`;

  const mailOptions = {
    from: '"Soporte Técnico" <support@example.com>',
    to: email,
    subject: "Recuperación de Contraseña",
    text: `Haz clic en el siguiente enlace para restablecer tu contraseña: ${resetLink}`,
    html: `<p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
          <a href="${resetLink}">${resetLink}</a>`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      return res.status(500).json({ error: "Error al enviar el correo." });
    }
    console.log("Correo enviado: " + nodemailer.getTestMessageUrl(info));
    res.status(200).json({
      message: "Enlace de recuperación enviado por correo.",
      previewUrl: nodemailer.getTestMessageUrl(info),
    });
  });
};

//Este método se encargará de validar el token de recuperación y actualizar la contraseña del usuario.
// Función común para actualizar la contraseña del usuario
const updateUserPassword = async (userId, newPassword) => {
  const pool = await getPool();
  const hashedPassword = await hash(newPassword, 10);
  await pool.query("UPDATE users SET password = ? WHERE id = ?", [
    hashedPassword,
    userId,
  ]);
};

const changePassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        error: "Debes proporcionar la contraseña actual y la nueva contraseña.",
      });
    }

    const pool = await getPool();
    const [users] = await pool.query(
      "SELECT password FROM users WHERE id = ?",
      [id]
    );

    if (users.length === 0) {
      return res.status(404).json({ error: "Usuario no encontrado." });
    }

    const user = users[0];

    const isPasswordValid = await compare(currentPassword, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Contraseña actual incorrecta." });
    }

    await updateUserPassword(id, newPassword);

    console.log(`✅ Contraseña cambiada con éxito para el usuario ID ${id}`);

    res.status(200).json({
      message: "Contraseña cambiada correctamente.",
      success: true,
    });
  } catch (error) {
    console.error("Error en changePassword:", error.message);
    res.status(500).json({ error: "Error interno del servidor." });
  }
};

const resetPassword = async (req, res) => {
  try {
    const schema = Joi.object({
      token: Joi.string().required(),
      newPassword: Joi.string().min(6).required(),
    });

    const { error, value } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { token, newPassword } = value;

    let payload;
    try {
      payload = verify(token, JWT_SECRET);
    } catch (err) {
      return res.status(400).json({ error: "Token inválido o expirado." });
    }

    if (!payload.userId || !payload.email) {
      return res.status(400).json({ error: "Token inválido." });
    }

    const { userId, email } = payload;

    // Verificar si el usuario existe antes de actualizar la contraseña
    const pool = await getPool();
    const [users] = await pool.query(
      "SELECT id FROM users WHERE id = ? AND email = ?",
      [userId, email]
    );

    if (users.length === 0) {
      return res
        .status(404)
        .json({ error: "El usuario asociado al token no fue encontrado." });
    }

    // Actualizar la contraseña utilizando la función común
    await updateUserPassword(userId, newPassword);

    console.log(`Contraseña restablecida para el usuario con ID: ${userId}`);

    // Enviar correo de confirmación de restablecimiento (no modificar)
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
      from: '"Soporte Técnico" <support@example.com>',
      to: email,
      subject: "Confirmación de Restablecimiento de Contraseña",
      text: "Tu contraseña ha sido restablecida correctamente.",
      html: "<p>Tu contraseña ha sido <strong>restablecida</strong> correctamente.</p>",
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error al enviar el correo:", error);
      } else {
        console.log(
          "Correo de confirmación enviado: " +
            nodemailer.getTestMessageUrl(info)
        );
      }
    });

    res.status(200).json({ message: "Contraseña actualizada correctamente." });
  } catch (err) {
    console.error("Error en resetPassword:", err.message);
    res.status(500).json({ error: "Error interno del servidor." });
  }
};

// ------------------------- ACTUALIZAR PERFIL DE USUARIO-------------------------
const updateUserProfile = async (req, res) => {
  console.log(
    "📡 Recibiendo solicitud de actualización de perfil para usuario ID:",
    req.params.id
  );
  console.log("🛠️ Datos recibidos en la solicitud:", req.body);

  try {
    const { id } = req.params;
    const { name, last_name, email, avatar, currentPassword } = req.body;

    if (!currentPassword) {
      console.error("⚠️ Falta la contraseña actual.");
      return res.status(400).json({
        error: "Debes ingresar tu contraseña actual para actualizar tu perfil.",
      });
    }

    const pool = await getPool();
    const [users] = await pool.query("SELECT * FROM users WHERE id = ?", [id]);

    if (users.length === 0) {
      console.error("❌ Usuario no encontrado.");
      return res.status(404).json({ error: "Usuario no encontrado." });
    }

    const user = users[0];

    console.log("🔍 Comparando contraseña actual...");
    const isPasswordValid = await compare(currentPassword, user.password);
    if (!isPasswordValid) {
      console.error("❌ Contraseña actual incorrecta.");
      return res
        .status(401)
        .json({ error: "La contraseña actual es incorrecta." });
    }

    console.log("✅ Contraseña verificada correctamente.");

    // Construcción de la consulta de actualización
    const updates = [];
    const values = [];

    if (name) {
      updates.push("name = ?");
      values.push(name);
    }
    if (last_name) {
      updates.push("last_name = ?");
      values.push(last_name);
    }
    if (email) {
      updates.push("email = ?");
      values.push(email);
    }
    if (avatar) {
      updates.push("avatar = ?");
      values.push(avatar);
    }

    if (updates.length > 0) {
      values.push(id);
      const updateQuery = `UPDATE users SET ${updates.join(", ")} WHERE id = ?`;
      await pool.query(updateQuery, values);

      console.log(
        `✅ Perfil actualizado para el usuario ID ${id}. Campos modificados: ${updates.join(
          ", "
        )}`
      );
    }

    if (avatar) {
      updates.push("avatar = ?");
      values.push(avatar);
    }

    res.status(200).json({ message: "Perfil actualizado correctamente." });
  } catch (error) {
    console.error("❌ Error en updateUserProfile:", error.message);
    res.status(500).json({ error: "Error interno del servidor." });
  }
};

// obtener datos del usuario

export const getUserProfile = async (req, res) => {
  console.log("📡 Ejecutando getUserProfile para el usuario ID:", req.user?.id);

  try {
    console.log("📡 Solicitando datos del usuario...");
    const pool = await getPool();
    const [users] = await pool.query(
      "SELECT id, username, email, avatar FROM users WHERE id = ?",
      [req.user.user_id]
    );

    if (users.length === 0) {
      console.error("❌ Usuario no encontrado.");
      return res.status(404).json({ error: "Usuario no encontrado." });
    }

    console.log("✅ Datos del usuario encontrados:", users[0]);
    res.status(200).json(users[0]); // Enviar datos al frontend
  } catch (error) {
    console.error("❌ Error en getUserProfile:", error.message);
    res.status(500).json({ error: "Error interno del servidor." });
  }
};

//**ELIMINAR CUENTA */

export const deleteUser = async (req, res) => {
  try {
    // Suponemos que el middleware de autenticación ya coloca al usuario en req.user
    const userId = req.user && req.user.id;
    if (!userId) {
      return res.status(401).json({ error: "Usuario no autenticado" });
    }
    const pool = await getPool();
    // Eliminar el usuario de la base de datos (ajusta la consulta según tu esquema)
    const [result] = await pool.query("DELETE FROM users WHERE id = ?", [
      userId,
    ]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    return res.status(200).json({ message: "Cuenta eliminada con éxito" });
  } catch (error) {
    console.error("Error al eliminar la cuenta:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Exportar las funciones
export default {
  registerUser,
  loginUser,
  passwordRecovery,
  updateUserPassword,
  changePassword,
  resetPassword,
  // sendPasswordResetNotification,
  updateUserProfile,
  getUserProfile,
  deleteUser,
};
