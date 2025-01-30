# Portal Meetups

### Proyecto colaborativo entre Francisco, Alexiel y Sheyla

---

SPRINT FRAN

## Estructura del Proyecto

- **Carpeta `node_modules/`**: Contiene todas las dependencias instaladas del proyecto. Esta carpeta no se sube al repositorio gracias a `.gitignore`, y se puede regenerar con `npm install`.

- **Carpeta `src/`**: Contiene el código fuente del proyecto.

  - **`controllers/`**: Incluye las funciones controladoras para manejar la lógica principal de las rutas (endpoints).

    - `userController.js`:
      - `registerUser`: Registro de usuarios.
      - `loginUser`: Inicio de sesión y generación de token JWT.
      - `passwordRecovery`: Generación de un enlace de recuperación de contraseña.
      - `changePassword`: Cambio de contraseña.
      - `resetPassword`: Restablecimiento de contraseña a través de un enlace seguro.
      - `sendPasswordResetNotification`: Envío de notificación por correo tras el cambio de contraseña.
      - `updateUserProfile`: Actualización del perfil del usuario.

  - **`middlewares/`**: Contiene funciones que se ejecutan entre la solicitud y la respuesta.

    - `authMiddleware.js`: Middleware que verifica si un token JWT es válido.
    - `uploadMiddleware.js`: Middleware para manejar la subida de archivos (como avatares).

  - **`routes/`**: Define las rutas y conecta cada endpoint con su controlador correspondiente.

    - `userRoutes.js`: Rutas relacionadas con los usuarios:
      - `POST /api/users/register`: Registro de usuarios.
      - `POST /api/users/login`: Inicio de sesión.
      - `POST /api/users/password-recovery`: Recuperación de contraseña.
      - `POST /api/users/reset-password`: Restablecimiento de contraseña.
      - `POST /api/users/password-reset-notification`: Notificación tras cambio de contraseña.
      - `PATCH /api/users/:id/profile`: Actualización del perfil del usuario.
      - `POST /api/users/profile/upload`: Subida de imagen de perfil.
      - `GET /api/users/protected`: Ejemplo de ruta protegida.

  - **`db/`**: Contiene utilidades relacionadas con la base de datos, como la conexión al pool y la inicialización.

  - **`utils/`**: Incluye funciones auxiliares utilizadas en varias partes del proyecto.

  - **`index.js`**: Archivo principal del proyecto que inicializa el servidor Express:
    - Configuración de middlewares globales (`body-parser`, `cors`, etc.).
    - Importación y uso de rutas desde `routes/`.
    - Manejo de errores (404 y generales).
    - Inicialización del servidor en el puerto definido.

- **Archivo `.env`**: Almacena variables de entorno como claves secretas y configuraciones sensibles.

- **Archivo `.gitignore`**: Especifica qué archivos o carpetas ignorar en el repositorio (como `node_modules/` y `.env`).

- **Archivo `package.json`**: Define las dependencias, scripts y metadatos del proyecto Node.js.

  - **Dependencias principales**:
    - `express`: Framework para construir el servidor.
    - `bcryptjs`: Para encriptar contraseñas.
    - `jsonwebtoken`: Para generar y verificar tokens JWT.
    - `joi`: Para validación de datos.
    - `nodemailer`: Para el envío de correos electrónicos.

---

## Funcionalidades Implementadas

### 1. Servidor Express

- Configuración inicial del servidor con middlewares básicos como `body-parser` y `cors`.
- Ruta base `GET /` para confirmar que el servidor está corriendo.

### 2. Registro de Usuarios (Sign Up)

- Endpoint: `POST /api/users/register`.
- Lógica:
  - Validación de datos con `Joi`.
  - Encriptación de contraseña con `bcryptjs`.
  - Inserción de datos en la base de datos.

### 3. Inicio de Sesión (Login)

- Endpoint: `POST /api/users/login`.
- Lógica:
  - Validación de credenciales.
  - Comparación de contraseñas encriptadas.
  - Generación de un token JWT válido.

### 4. Recuperación de Contraseña

- Endpoint: `POST /api/users/password-recovery`.
- Lógica:
  - Generación de un token único con información del usuario.
  - Envío de un enlace seguro por correo.

### 5. Restablecimiento de Contraseña

- Endpoint: `POST /api/users/reset-password`.
- Lógica:
  - Validación del token recibido.
  - Actualización de la contraseña del usuario.
  - Envío de correo de confirmación tras el cambio.

### 6. Middleware de Autenticación

- Middleware: `authenticateUser`.
- Lógica:
  - Verifica la validez del token JWT.
  - Adjunta los datos del usuario al objeto `req`.

### 7. Actualización del Perfil

- Endpoint: `PATCH /api/users/:id/profile`.
- Lógica:
  - Permite a los usuarios actualizar su información (como nombre, apellido y avatar).
  - Autenticación requerida para garantizar que el usuario esté autorizado a realizar cambios.

### 8. Subida de Imagen de Perfil

- Endpoint: `POST /api/users/profile/upload`.
- Lógica:
  - Utiliza el middleware `uploadMiddleware` para manejar la subida de archivos.
  - Almacena la ruta del archivo en el perfil del usuario.

### 9. Rutas Protegidas

- Ejemplo: `GET /api/users/protected`.
- Solo accesible con un token JWT válido.

### 10. Notificación por Cambio de Contraseña

- Endpoint: `POST /api/users/password-reset-notification`.
- Envío de un correo al usuario notificando el cambio exitoso.

---

## Proceso de Desarrollo

1. **Inicio del Proyecto**:

   - Instalación de dependencias necesarias (`express`, `dotenv`, `cors`, etc.).
   - Configuración inicial del servidor en `index.js`.

2. **Base de Datos**:

   - Configuración del pool de conexión a MySQL.
   - Estructuración de tablas relevantes (`users`, `password_recovery`, etc.).

3. **Endpoints de Usuarios**:

   - Registro, inicio de sesión, recuperación y cambio de contraseña.

4. **Integración de Middleware**:

   - Autenticación y manejo de errores.

5. **Envío de Correos**:

   - Simulación con `nodemailer` usando cuentas de prueba de Ethereal.

6. **Subida y Manejo de Archivos**:
   - Configuración del middleware para permitir a los usuarios subir imágenes.

---

## Cómo Ejecutar el Proyecto

1. Clonar el repositorio:

   ```bash
   git clone <url-del-repositorio>
   ```

2. Instalar dependencias en Backend:
   ```bash
   cd Backend
   ```

   ```bash
   npm install
   ```
   
3. Instalar dependencias en Frontend:
   ```bash
   cd Frontend
   ```

   ```bash
   npm install
   ```

4. Configurar variables de entorno:

   - Crear un archivo `.env` basado en el ejemplo proporcionado.

5. Iniciar el Backend:
   ```bash
   cd Backend
   ```

   ```bash
   npm start
   ```
   
6. Iniciar el Frontend:
  ```bash
   cd Frontend
   ```
   ```bash
   npm start
   ```

7. Probar los endpoints usando herramientas como Postman.
