# KayrosGo / Cle_Broker – Backend API

Backend modular en Node.js + Express con PostgreSQL y Prisma para manejar los formularios, contenidos turísticos y panel administrativo de KayrosGo / Cle_Broker.

## Requisitos

- Node.js 20+
- PostgreSQL 14+
- npm 9+

## Configuración rápida

1. Copia el archivo de variables de entorno:

   - **Linux / macOS:**

     ```bash
     cp .env.example .env
     ```

   - **Windows (PowerShell o CMD):**

     ```powershell
     copy .env.example .env
     ```

2. Ajusta las variables obligatorias en `.env`:

   - `DATABASE_URL=postgresql://usuario:clave@localhost:5432/cle_broker`
   - `JWT_SECRET` (cadena segura)
   - `ADMIN_EMAIL` y `ADMIN_PASSWORD`
   - Parámetros SMTP (`SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`)

3. Instala dependencias y genera el cliente Prisma (los comandos son los mismos en Windows, macOS y Linux):

   ```bash
   npm install
   npx prisma generate
   ```

4. Ejecuta las migraciones y datos iniciales:

   ```bash
   npx prisma migrate deploy
   npm run seed
   ```

   > 💡 En Windows puedes ejecutar estos comandos desde PowerShell, CMD o la terminal integrada de tu editor (VS Code). No es
   > necesario usar WSL, aunque también es compatible.

5. Inicia el servidor en desarrollo:

   ```bash
   npm run dev
   ```

   Si prefieres un script dedicado en Windows, puedes usar `npm run dev` dentro de `run.bat` o crear un acceso directo.

El API queda disponible en `http://localhost:3000`.

## Docker

```bash
docker-compose up --build -d
```

El servicio expone el API en el puerto `3000` y un contenedor PostgreSQL en `5432`.

## Scripts disponibles

| Comando            | Descripción                                     |
|--------------------|-------------------------------------------------|
| `npm run dev`      | Inicia el servidor con recarga automática        |
| `npm run build`    | Compila TypeScript a JavaScript (`dist/`)        |
| `npm start`        | Ejecuta el servidor compilado                    |
| `npm run seed`     | Inserta usuario admin y contenido por defecto    |
| `npm test`         | Ejecuta la suite de pruebas con Jest + Supertest |

## Estructura de carpetas

```
src/
├── core/            # utilidades transversales (env, prisma, mailer, logger)
├── modules/
│   ├── forms/       # formularios contacto y cotización
│   ├── tourism/     # programas, beneficios y testimonios
│   ├── cle_broker/  # servicios Cle_Broker
│   ├── public/      # endpoint de propuesta consolidada
│   └── users/       # autenticación administrativa
├── routes/          # composición de rutas Express
├── scripts/         # semilla inicial
└── tests/           # pruebas (Jest + Supertest)
```

## Endpoints principales (`/api`)

### Forms

- `POST /forms/contacto`

  ```bash
  curl -X POST http://localhost:3000/api/forms/contacto \
    -H "Content-Type: application/json" \
    -d '{"nombre":"Ana","email":"ana@example.com","whatsapp":"+573001112233","destinoInteres":"Cancún"}'
  ```

- `POST /forms/cotizacion`

  ```bash
  curl -X POST http://localhost:3000/api/forms/cotizacion \
    -H "Content-Type: application/json" \
    -d '{"nombre":"Luis","email":"luis@example.com","whatsapp":"+573004445566","programaId":1,"mensaje":"Viaje familiar en julio"}'
  ```

### Tourism

- `GET /tourism/programas?visible=true`
- `POST /tourism/programas` *(requiere JWT)*
- `GET /tourism/beneficios`
- `GET /tourism/testimonios?visible=true`

### Cle_Broker servicios

- `GET /cle-broker/servicios?visible=true`
- `POST /cle-broker/servicios` *(requiere JWT)*

### Contenido público

- `GET /public/propuesta` – Devuelve beneficios, programas destacados, proceso y servicios Cle_Broker listos para renderizar en el frontend.

### Autenticación

- `POST /auth/login` (email + password) → token JWT
- `GET /auth/me` (header `Authorization: Bearer <token>`)

### Salud

- `GET /healthz`

## Ejemplos `fetch` para integrar con el frontend existente

```javascript
// Enviar formulario de contacto
async function enviarContacto(payload) {
  const respuesta = await fetch('/api/forms/contacto', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!respuesta.ok) throw new Error('No se pudo enviar el contacto');
  return respuesta.json();
}

// Enviar solicitud de cotización
async function enviarCotizacion(payload) {
  const respuesta = await fetch('/api/forms/cotizacion', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!respuesta.ok) throw new Error('No se pudo registrar la cotización');
  return respuesta.json();
}

// Consumir contenido consolidado de propuesta
async function cargarPropuesta() {
  const respuesta = await fetch('/api/public/propuesta');
  if (!respuesta.ok) throw new Error('No se pudo cargar la propuesta');
  const data = await respuesta.json();
  // data.beneficios, data.programasDestacados, data.serviciosCleBroker, data.proceso, data.testimonios, data.membresiaCodigo
  return data;
}
```

## Seguridad

- Helmet + CORS restringido por `CORS_ORIGIN`
- Rate limiting configurable (`RATE_LIMIT_*`)
- JWT con expiración `JWT_EXPIRES_IN`
- Auditoría básica en formularios (IP, user-agent y referer)

## Pruebas

La suite usa Jest + Supertest con mocks de Prisma y Nodemailer para validar rutas críticas (`forms`, `auth`, `tourism`). Ejecuta:

```bash
npm test
```

## Migraciones

El archivo `migrations/0001_init.sql` replica la estructura del schema Prisma para despliegues en infraestructuras donde `prisma migrate` no está disponible.

## Nota sobre correo

El envío usa Nodemailer; en ambiente de pruebas (`NODE_ENV=test`) se aplica un transporte JSON (no se envían correos reales). Configura tus credenciales SMTP reales para producción.
