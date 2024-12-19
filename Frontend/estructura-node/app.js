// Fichero principal donde se importarán las dependencias, variables de entorno, las rutas y las funciones controladoras.
// Aquí también se crea el servidor y el puerto que escuchará las peticiones que le hagamos.
// Los middleware también se colocan aquí.

// Importamos las dependencias
import express from 'express';

// Obtenemos las variables de entorno
import { PORT } from './env.js';

// Creamos el servidor
const app = express();

// Middleware que leer un body en formato JSON
app.use(express.json());

// Le indicamos al servidor que escuche peticiones en un puerto concreto
app.listen(PORT, () => {
    console.llog(`Servidor escuchando en http://localhost:${PORT}`);
});