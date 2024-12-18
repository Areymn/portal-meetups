// Aquí se tendrá acceso a las variables de entorno personalizadas.
// Las variables de entorno se utilizan para poder definir parámetros básicos a la hora de crear un programa y que estos se ejecuten en diferentes ordenadores sin tener que modificar el código constantemente.

// Usamos el método config de dotenv para acceder a las variables de entorno personalizadas.
import 'dotenv/config';

// Obtenemos las variables de entorno.
const {
    MYSQL_HOST,
    MYSQL_USER,
    MYSQL_PASS,
    MYSQL_DB,
    PORT,
    SECRET,
    UPLOADS_DIR,
} = process.env;

// Exportamos las variables
export {
    MYSQL_HOST,
    MYSQL_USER,
    MYSQL_PASS,
    MYSQL_DB,
    PORT,
    SECRET,
    UPLOADS_DIR,
};
