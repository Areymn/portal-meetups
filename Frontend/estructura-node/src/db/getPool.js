console.log("Holaaaaa");
// Importamos las dependencias
import mysql from "mysql2/promise";

// Creamos la constante pool para manejar de manera directa la base de datos. Para ello hay que indicarle los datos de nuestra db. 
const pool = mysql.createPool({
    host: MYSQL_HOST,
    user: MYSQL_USER,
    password: MYSQL_PASS,
    database: MYSQL_DB,
    timezone: "Z",
})