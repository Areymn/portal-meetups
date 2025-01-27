"use strict";

import getPool from "../../db/getPool.js";
import Joi from "joi";

// -------------------------
// FUNCIÓN ESPECÍFICA: OBTENER EVENTOS ORDENADOS
// -------------------------

export const getEvents = async (req, res) => {
  try {
    // Esquema de validación con Joi
    const schema = Joi.object({
      sort: Joi.string().valid("id", "name", "time").default("id"), // Campos válidos para ordenar
      type: Joi.string().valid("asc", "desc").default("asc"), // Tipos de orden válidos
    }).unknown(false);

    // Validar los datos de la query
    const { error, value } = schema.validate(req.query);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { sort, type } = value;

    // Conectar con la base de datos
    const pool = await getPool();

    // Consulta para obtener eventos ordenados
    const [events] = await pool.query(
      `SELECT * FROM events ORDER BY ?? ${type === "asc" ? "ASC" : "DESC"}`,
      [sort]
    );

    // Responder con los eventos obtenidos
    return res.status(200).json({ events });
  } catch (err) {
    console.error("Error en el controlador getEvents:", err.message);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// -------------------------
// EXPORTAR FUNCIONES
// -------------------------
export default { getEvents };
