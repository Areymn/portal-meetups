"use strict";

import jwt from "jsonwebtoken"; // Importa la librería JWT para verificar los tokens

/**
 * Middleware de autenticación.
 * Verifica la validez de un token JWT en el encabezado `Authorization`.
 * Si es válido, añade los datos del usuario a `req.user`.
 * Devuelve un error si el token no existe, es inválido o está expirado.
 */
export const authenticateUser = (req, res, next) => {
  try {
    console.log("📡 Middleware de autenticación activado.");

    // Extraer el token del encabezado Authorization
    const authHeader = req.headers["authorization"];
    console.log("🔑 Encabezado de autorización recibido:", authHeader);

    if (!authHeader) {
      console.error("❌ No se recibió encabezado de autorización.");
      return res.status(401).json({ error: "Token no proporcionado." });
    }

    const parts = authHeader.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer") {
      console.error("❌ Formato de token inválido. Debe ser 'Bearer <token>'.");
      return res
        .status(401)
        .json({ error: "Formato de token inválido. Usa 'Bearer <token>'." });
    }

    const token = parts[1];
    console.log("🔍 Token extraído:", token);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("✅ Token verificado:", decoded);

    req.user = decoded;
    console.log("🛠️ Usuario autenticado en el middleware:", req.user);

    next();
  } catch (err) {
    console.error("❌ Error al autenticar token:", err.message);

    if (err.name === "TokenExpiredError") {
      return res.status(403).json({ error: "El token ha expirado." });
    } else if (err.name === "JsonWebTokenError") {
      return res.status(403).json({ error: "Token inválido." });
    } else {
      return res.status(500).json({ error: "Error interno del servidor." });
    }
  }
};

export default { authenticateUser }; // Exportar la función para usarla en rutas protegidas
