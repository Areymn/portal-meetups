// Importamos la función que retorna un pool de conexiones.
import getPool from './getPool.js';

// Función que creará las tablas de la base de datos.
const createTables = async () => {
    try {
        // Obtenemos el pool de conexiones.
        const pool = await getPool();

        console.log('Borrando tablas...');

        // Borramos las tablas.
        await pool.query(
            'DROP TABLE IF EXISTS cities, themes, events, users',
        );

        console.log('Creando tablas...');

        // Creamos la tabla de las ciudades.
        await pool.query(`
            CREATE TABLE IF NOT EXISTS cities (
                id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
                name VARCHAR(50) NOT NULL UNIQUE,
                createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                editeAt TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        `);

        // Creamos la tabla de las temáticas.
        await pool.query(`
            CREATE TABLE IF NOT EXISTS themes (
                id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
                name VARCHAR(100) NOT NULL UNIQUE,
                createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                editeAt TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
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
                editeAt TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,    
                FOREIGN KEY (cityId) REFERENCES cities(id),
                FOREIGN KEY (themeId) REFERENCES themes(id)
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
                editeAt TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        `);


        console.log('¡Tablas creadas!');

        // Cerramos el proceso con código 0 indicando que todo ha ido bien.
        process.exit(0);
    } catch (err) {
        console.error(err);

        // Cerramos el proceso con código 1 indicando que hubo un error.
        process.exit(1);
    }
};

// Llamamos a la función anterior.
createTables();
