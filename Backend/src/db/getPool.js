console.log("Holaaaaa");
// Importamos las dependencias
import mysql from "mysql2/promise";
import dotenv from "dotenv";
// Importamos las variables de entorno.

dotenv.config(); // Carga las variables de entorno desde .env

console.log("MYSQL_HOST:", process.env.MYSQL_HOST);
console.log("MYSQL_USER:", process.env.MYSQL_USER);
console.log("MYSQL_PASS:", process.env.MYSQL_PASS);
console.log("MYSQL_DB:", process.env.MYSQL_DB);

// Variable que almacenará un pool de conexiones.
let pool;

// Función que retorna un pool de conexiones.
const getPool = async () => {
  try {
    // Si no hay un pool de conexiones, es decir, si la variable pool contiene un
    // valor considerado falso, creamos el pool
    if (!pool) {
      // // Creamos un pool temporal con el único fin de crear la base de datos.
      // const tempPool = await mysql.createPool({
      //   host: process.env.MYSQL_HOST,
      //   user: process.env.MYSQL_USER,
      //   password: process.env.MYSQL_PASS,
      //   // database: process.env.MYSQL_DB,
      // });
      // Creamos el pool de conexiones final. Este método asume que la base de datos ya existe.
      pool = mysql.createPool({
        host: process.env.MYSQL_HOST,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASS,
        database: process.env.MYSQL_DB,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
        timezone: "+01:00", // Ajustar la zona horaria según sea necesario
      });

      // // Ahora que tenemos un pool temporal creamos la base de datos si no existe.
      // await tempPool.query(
      //   `CREATE DATABASE IF NOT EXISTS ${process.env.MYSQL_DB}`
      // );
      // tempPool.end(); // Cerramos el pool temporal

      // Si la base de datos no existe, puedes manejar la lógica de creación aquí o asegurarte de que se crea fuera de este script.
      try {
        await pool.query(
          `CREATE DATABASE IF NOT EXISTS ${process.env.MYSQL_DB}`
        );
      } catch (err) {
        console.error("Error al crear la base de datos:", err);
      }
    }

    // Retornamos el pool.
    return pool;
  } catch (err) {
    console.error("Error al crear o utilizar el pool de conexiones:", err);
    throw err; // Re-lanzamos el error para manejarlo más arriba si es necesario
  }
};

// Exportamos la función anterior.
export default getPool;
