console.log("Holaaaaa");
// Importamos las dependencias
import mysql from "mysql2/promise";

// Importamos las variables de entorno.
import { MYSQL_HOST, MYSQL_USER, MYSQL_PASS, MYSQL_DB } from '../../env.js';

// Variable que almacenará un pool de conexiones.
let pool;

// Función que retorna un pool de conexiones.
const getPool = async () => {
    try {
        // Si no hay un pool de conexiones, es decir, si la variable pool contiene un
        // valor considerado falso, creamos el pool
        if (!pool) {
            // Creamos un pool temporal con el único fin de crear la base de datos.
            pool = await mysql.createPool({
                host: MYSQL_HOST,
                user: MYSQL_USER,
                password: MYSQL_PASS
            });

            // Ahora que tenemos un pool temporal creamos la base de datos si no existe.
            await pool.query(`CREATE DATABASE IF NOT EXISTS ${MYSQL_DB}`);

            // Creamos el pool de conexiones final. Este método NO genera la base de datos en 
            // caso de no existir, por ese motivo la hemos creado en el paso anterior.
            pool = await mysql.createPool({
                host: MYSQL_HOST,
                user: MYSQL_USER,
                password: MYSQL_PASS,
                database: MYSQL_DB,
                timezone: 'Z',
            });
        }

        // Retornamos el pool.
        return pool;
    } catch (err) {
        console.error(err);
    }
};

// Exportamos la función anterior.
export default getPool;