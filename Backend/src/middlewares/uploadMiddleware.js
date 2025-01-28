"use strict";

import { dirname } from "path";
import { fileURLToPath } from "url";
import multer from "multer";
import path from "path";

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
  upload(req, res, (err) => {
    if (err) {
      console.error(`❌ Error en la subida de archivo: ${err.message}`);
      return res.status(400).json({ error: err.message });
    }

    if (!req.file) {
      console.error("❌ Error: No se subió ningún archivo.");
      return res.status(400).json({ error: "No se subió ningún archivo." });
    }

    console.log(
      `✅ Foto subida con éxito para el usuario ID: ${req.user.user_id}`
    );
    console.log(`📂 Ruta del archivo: ${req.file.path}`);

    res.status(200).json({
      message: "Foto subida con éxito.",
      filePath: req.file.path,
    });
  });
};

export { handleFileUpload };
