// Aquí se crearán las funciones que realizan funciones a la base de datos para crear, editar o eliminar información

import { getPool } from "../../db/getPool.js";

export const createUser = async (userData) => {
  const pool = await getPool();
  const { username, email, password } = userData;

  const [result] = await pool.query(
    "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
    [username, email, password]
  );

  return result.insertId; // Devuelve el ID del nuevo usuario
};
