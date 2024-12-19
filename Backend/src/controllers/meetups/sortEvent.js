"use strict";

const jwt = require("jsonwebtoken"); // Para generar y verificar tokens JWT
const bcrypt = require("bcryptjs"); // Para encriptar y comparar contraseñas
const Joi = require("joi"); // Para validar los datos recibidos
const nodemailer = require("nodemailer"); // Para enviar correos (simulado)
const crypto = require("crypto"); // Para generar códigos únicos (recuperación de contraseña)

//Clave secreta para JWT, tomada de variables de entorno (log in)
const JWT_SECRET = process.env.JWT_SECRET || "secret_key"; // Clave secreta para el token