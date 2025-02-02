"use strict";

import { dirname } from "path";
import { fileURLToPath } from "url";
import multer from "multer";
import path from "path";
import getPool from "../db/getPool.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Extensiones permitidas
const allowedExtensions = [".jpg", ".jpeg", ".png", ".gif"];

// Configurar el almacenamiento
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../uploads")); // Ruta de almacenamiento
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

// Filtro para validar el tipo de archivo
const fileFilter = (req, file, cb) => {
  const fileExt = path.extname(file.originalname).toLowerCase();

  if (allowedExtensions.includes(fileExt)) {
    cb(null, true);
  } else {
    console.error(`❌ Error: Extensión no permitida: ${fileExt}`);
    cb(
      new Error(
        `Extensión no permitida: ${fileExt}. Solo se permiten imágenes: ${allowedExtensions.join(
          ", "
        )}`
      )
    );
  }
};

// Middleware de subida con logs y validaciones
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limitar tamaño a 5MB
}).single("photo");

// Middleware personalizado para manejar errores de subida
const handleFileUpload = (req, res, next) => {
  // 💾 Guardar el usuario autenticado antes de llamar a multer
  const authenticatedUser = req.user;

  upload(req, res, async (err) => {
    // 🚨 Si multer reemplaza `req`, lo restauramos
    req.user = authenticatedUser;

    if (err) {
      console.error(`❌ Error en la subida de archivo: ${err.message}`);
      return res.status(400).json({ error: err.message });
    }

    if (!req.file) {
      console.error("❌ Error: No se subió ningún archivo.");
      return res.status(400).json({ error: "No se subió ningún archivo." });
    }

    console.log(`✅ Foto subida con éxito: ${req.file.path}`);
    console.log("🔍 Verificando `req.user` después de restaurar:", req.user);

    if (!req.user || !req.user.user_id) {
      console.error(
        "❌ Error: No se encontró un usuario autenticado en `req.user` después de la subida."
      );
      return res.status(401).json({ error: "Usuario no autenticado." });
    }

    // ✅ Actualizar avatar en la base de datos
    try {
      const pool = await getPool();
      await pool.query("UPDATE users SET avatar = ? WHERE id = ?", [
        req.file.filename,
        req.user.user_id, // 🔄 Verificar que el ID es correcto
      ]);

      console.log(
        `🔄 Avatar actualizado en la BD para el usuario ID: ${req.user.user_id}`
      );
      res.status(200).json({
        message: "Foto subida y avatar actualizado con éxito.",
        filePath: req.file.path,
      });
    } catch (error) {
      console.error(
        "❌ Error al actualizar avatar en la base de datos:",
        error
      );
      res.status(500).json({ error: "Error interno al actualizar el avatar." });
    }
  });
};

export { handleFileUpload };
