"use strict";

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Joi = require("joi");

//LOGIN
const JWT_SECRET = process.env.JWT_SECRET || "secret_key"; // Clave secreta para el token

//Base de datos simulada
const users = [];

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
