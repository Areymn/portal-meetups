"use strict";

const jwt = require("jsonwebtoken");

//Middleware de autenticacion
const authenticateUser = (req, res, next) => {
  const token = req.headers["authorization"]; // Lee el token del encabezado

  if (!token) {
    return res.status(401).json({ error: "No se proporciono un token" }); //No autorizado
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verificar el token
    req.user = decoded; // Adjuntar el usuario decodificado a la solicitud
    next(); // Pasar al siguiente middleware o controlador
  } catch (err) {
    return res.status(403).json({ error: "Token inválido o expirado" }); //Prohibido
  }
};

module.exports = { authenticateUser };
