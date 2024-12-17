# portal-meetups

Proyecto colaborativo entre Carmen, Francisco, Alexiel y Sheyla

# Fran sprint 1

ESTRUCTURA

-Carpeta -node_modules/ = Contiene todas las dependencias instaladas del proyecto.
Se evita subir a git posteriormente con el documento .gitignore puesto que es muy grande y se puede regenerar usando: npm install.
Ademas se genera de manera automatica en caso de borrarla utilizando el mismo comando.

-Carpeta src/ = Contiene todo el código fuente del proyecto, es decir, los archivos que componen la aplicación backend.

> controllers/ = Almacena las funciones controladoras que manejan la lógica principal de las rutas (Endpoints).
> Mantiene la lógica separada de las rutas para un código modular y más limpio.

      userController.js:

         ·registerUser → Lógica de registro de usuarios.
         ·loginUser → Lógica del login y generación de token JWT.
         ·passwordRecovery → Lógica para generar un código de recuperación.
         ·changePassword → Lógica para cambiar la contraseña.

> middlewares/ = Almacena funciones intermedias que se ejecutan entre la solicitud y la respuesta.
> Permiten reutilizar lógica común (como autenticación) y aplicarla fácilmente a múltiples rutas.

      authMiddleware.js: Middleware de autenticación que verifica si un token JWT es válido antes de permitir el acceso a rutas protegidas.

> routes/ = Define las rutas y conecta cada endpoint con su controlador correspondiente.
> Mantiene todas las rutas organizadas y separadas de la lógica principal.

      userRoutes.js: Contiene las rutas relacionadas con los usuarios:

         ·POST /api/users/register → Registro de usuario.
         ·POST /api/users/login → Login de usuario.
         ·POST /api/users/password-recovery → Recuperación de contraseña.
         ·POST /api/users/change-password → Cambio de contraseña.
         ·GET /api/users/protected → Ejemplo de ruta protegida.

> index.js: Archivo principal del proyecto que inicializa el servidor Express.

      ·Configuración de middlewares globales (body-parser, cors, etc.).
      ·Importación y uso de rutas desde routes/.
      ·Manejo de errores (404 y generales).
      ·Inicialización del servidor en el puerto definido.

-Archivo env. : Almacena variables de entorno (claves secretas y configuraciones).
Mantiene la información sensible fuera del código fuente.

-Archivo .gitignore : Indica a Git qué archivos o carpetas ignorar (node_modules/, .env)
Evita subir archivos innecesarios o sensibles al repositorio.

-Archivo package-lock.json : Guarda las versiones exactas de las dependencias instaladas para que el proyecto funcione de la misma manera en cualquier lugar.
Aunque se puede regenerar, borrarlo puede llevar a inconsistencias en versiones de dependencias cuando trabajas en equipo.

-Archivo package.json: Define las dependencias y scripts del proyecto Node.js.

> Lista de dependencias (express, bcryptjs, jsonwebtoken, etc.).
> Scripts como start y dev para iniciar el servidor.

//**************\*\*\*\***************\***************\*\*\*\***************

1.  Creación del SERVIDOR con Express

    Configuracion de un servidor básico con Express.

    -Busque que dependencias eran necesarias instalar para el proyecto (express, dotenv, cors, etc.).

    -Creamos el archivo index.js como punto de entrada principal.

    -Configuramos middlewares básicos: >bodyParser.json() para parsear el body de las solicitudes. >cors() para permitir peticiones desde otros dominios.

    -Añadimos una ruta base (GET /) para confirmar que el servidor funcionaba.

          >Resultado: Servidor corriendo correctamente en http://localhost:5000.

2.  Endpoint de SIGN UP (REGISTRO) de usuarios

    Para permitir que los usuarios se registren.

    -Creamos la ruta POST /api/users/register en userRoutes.js.

    -Implementamos la lógica en el controlador registerUser: >Validación de datos usando Joi (email, username, password). >Encriptación de la contraseña con bcryptjs. >Simulamos una base de datos en memoria usando un array (users).

    -Probamos la ruta con Postman.

          >Resultado: Los usuarios pueden registrarse exitosamente.

3.  Endpoint de LOGIN (INICIO DE SESION) de usuarios

    Permite que los usuarios inicien sesión y obtiene un token JWT.

    -Creamos la ruta POST /api/users/login en userRoutes.js.

    -Implementamos la lógica en el controlador loginUser: >Validación de datos (email y contraseña). >Comparación de contraseñas usando bcrypt.compare. >Generación de un token JWT con jsonwebtoken que contiene datos del usuario.

    -Probamos la ruta con Postman.

          >Resultado: Los usuarios pueden iniciar sesión y reciben un token JWT válido.

4.  Endpoint de recuperación de CONTRASEÑA

    Envia un código de recuperación a un usuario que olvidó su contraseña.

    -Creamos la ruta POST /api/users/password-recovery.

    -Implementamos la lógica en el controlador passwordRecovery: >Validación del email con Joi. >Generación de un código único con crypto.randomBytes. >Simulamos el envío del código a través de consola (usamos un objeto recoveryCodes para almacenarlo temporalmente).

    -Probamos la ruta para confirmar que el código se genera.

          >Resultado: El código de recuperación se genera y almacena correctamente.

5.  Endpoint de cambio de CONTRASEÑA
    Permite que el usuario cambie su contraseña usando el código de recuperación.

    -Creamos la ruta POST /api/users/change-password.

    -Implementamos la lógica en el controlador changePassword: >Validación del email, código de recuperación y nueva contraseña. >Verificación de que el código de recuperación coincide. >Encriptación de la nueva contraseña con bcrypt. >Actualización de la contraseña en la "base de datos".

    -Probamos la ruta con el código generado.

          >Resultado: El usuario puede cambiar su contraseña exitosamente.

6.  Middleware de verificación de AUTENTICACION

    Implementación del middleware para proteger rutas privadas.

    -Creamos el archivo authMiddleware.js.

    -Implementamos el middleware authenticateUser: >Verificación de que el token JWT existe y es válido. >Adjuntamos la información del usuario decodificada a req.user.

    -Probamos el middleware creando una ruta protegida temporal en userRoutes.js.

          >Resultado: Las rutas protegidas ahora requieren un token JWT válido para ser accesibles.
