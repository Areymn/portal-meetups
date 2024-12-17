"use strict";

const jwt = require("jsonwebtoken");

//Middleware de autenticacion
const authenticateUser = (req, res, next) => {
  try {
    // Obtiene el token del encabezado Authorization
    const token = req.headers["authorization"];

    if (!token) {
      return res
        .status(401)
        .json({ error: "Acceso denegado: No se proporcionó un token" }); //No autorizado
    }

    // Verificar el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Adjuntar la información del usuario decodificado a la solicitud
    req.user = decoded;

    // Pasar al siguiente middleware o controlador
    next();
  } catch (err) {
    console.error("Error en autenticación:", err.message);
    return res.status(403).json({ error: "Token inválido o expirado" }); //Prohibido
  }
};

module.exports = { authenticateUser };
