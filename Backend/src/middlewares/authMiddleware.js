"use strict";

import jwt from "jsonwebtoken"; // Importa la librería JWT para verificar los tokens
const { verify } = jwt;
/**
 * Middleware de autenticación.
 * Verifica la validez de un token JWT en el encabezado `Authorization`.
 * Si es válido, añade los datos del usuario a `req.user`.
 * Devuelve un error si el token no existe, es inválido o está expirado.
 */

export const authenticateUser = (req, res, next) => {
  // Extraer el token del encabezado Authorization
  const token = req.headers["authorization"];

  // Si no existe el token, devuelve un error 401 (No autorizado)
  if (!token) {
    return res.status(401).json({ error: "No se proporciono un token" });
  }

  try {
    // Verificar el token utilizando la clave secreta
    const decoded = verify(token, process.env.JWT_SECRET);

    // Adjuntar el usuario decodificado del usuario a la solicitud
    req.user = decoded;

    // Pasar al siguiente middleware o controlador
    next();
  } catch (err) {
    // Si el token es inválido o expirado, devuelve un error 403 (Prohibido)
    return res.status(403).json({ error: "Token inválido o expirado" });
  }
};

export default { authenticateUser }; // Exportar la función para usarla en rutas protegidas
