"use strict";

const jwt = require("jsonwebtoken"); // Importa la librería JWT para verificar los tokens

/**
 * Middleware de autenticación.
 * Verifica la validez de un token JWT en el encabezado `Authorization`.
 * Si es válido, añade los datos del usuario a `req.user`.
 */

const authenticateAdmin = (req, res, next) => {
  // Extraer el token del encabezado Authorization
  const token = req.headers["authorization"];

  // Si no existe el token, devuelve un error 401 (No autorizado)
  if (!token) {
    return res.status(401).json({ error: "No se proporciono un token" });
  }

  try {
    // Verificar el token utilizando la clave secreta
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Adjuntar el usuario decodificado del usuario a la solicitud
    req.user = decoded;
    if (!user.isAdmin) {
        return res.status(403).json({ error: "Este usuario no tiene permisos de administrador" });
    }
    // Pasar al siguiente middleware o controlador
    next();
  } catch (err) {
    // Si el token es inválido o expirado, devuelve un error 403 (Prohibido)
    return res.status(403).json({ error: "Token inválido o expirado" });
  }
};

module.exports = { authenticateAdmin }; // Exportar la función para usarla en rutas protegidas