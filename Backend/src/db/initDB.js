// Importamos la función que retorna un pool de conexiones.
import getPool from "./getPool.js";

// Función que creará las tablas de la base de datos.
const createTables = async () => {
  try {
    console.log("Iniciando la configuración de la base de datos...");

    // Obtenemos el pool de conexiones.
    const pool = await getPool();

    console.log("Borrando tablas existentes...");

    // Borramos las tablas en el orden correcto para evitar problemas de restricciones de clave foránea.
    await pool.query("DROP TABLE IF EXISTS events, users, themes, cities");

    console.log("Creando tablas nuevas...");

    // Creamos la tabla de las ciudades.
    await pool.query(`
      CREATE TABLE IF NOT EXISTS cities (
        id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(50) NOT NULL UNIQUE,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      );
    `);

    // Creamos la tabla de las temáticas.
    await pool.query(`
      CREATE TABLE IF NOT EXISTS themes (
        id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(100) NOT NULL UNIQUE,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      );
    `);

    // Creamos la tabla de los eventos.
    await pool.query(`
      CREATE TABLE IF NOT EXISTS events (
        id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
        title VARCHAR(500) NOT NULL,
        description TEXT NOT NULL,
        foto_avatar VARCHAR(350) NOT NULL,
        place VARCHAR(500) NOT NULL,
        date DATETIME NOT NULL,
        cityId INT UNSIGNED NOT NULL,
        themeId INT UNSIGNED NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (cityId) REFERENCES cities(id) ON DELETE CASCADE,
        FOREIGN KEY (themeId) REFERENCES themes(id) ON DELETE CASCADE
      );
    `);

    // Creamos la tabla de los usuarios.
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
        username VARCHAR(100) NOT NULL,
        email VARCHAR(150) UNIQUE NOT NULL,
        password VARCHAR(100) NOT NULL,
        name VARCHAR(150) NOT NULL,
        last_name VARCHAR(150) NOT NULL,
        avatar VARCHAR(500) NOT NULL,
        rol ENUM("admin", "user") DEFAULT "user",
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      );
    `);

    // Insertamos datos iniciales
    console.log("Insertando datos iniciales...");

    await pool.query(`
       INSERT INTO cities (name) VALUES 
       ('Málaga'), 
       ('Granada'), 
       ('Sevilla'), 
       ('Cádiz');
     `);

    await pool.query(`
       INSERT INTO themes (name) VALUES 
       ('Tecnología'), 
       ('Cultura'), 
       ('Deporte'), 
       ('Ciencia');
     `);

    console.log("¡Datos iniciales insertados!");

    console.log("¡Tablas creadas exitosamente!");

    // Cerramos el pool al final
    await pool.end();
    console.log("Conexión a la base de datos cerrada.");
  } catch (err) {
    console.error("Error durante la configuración de la base de datos:", err);
    process.exit(1); // Salimos con código de error
  }
};

export default createTables;
