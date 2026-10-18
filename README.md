# Bicileal Multiplataforma

Tienda web, aplicación móvil y API para Bicileal, organizadas en un único
repositorio.

## Componentes

- `frontend/`: React y Vite.
- `mobile/`: React Native y Expo.
- `backend/`: API REST en Node.js, Express y Prisma.

## Ejecutar localmente

Requiere Node.js LTS y npm. La base local de desarrollo usa SQLite; `dev.db` y
los archivos `.env` son locales y no se incluyen en Git.

1. Instalar las dependencias del backend y crear su base local:

   ```powershell
   cd backend
   npm install
   npm run db:push
   npm run dev
   ```

   La API local queda disponible en `http://localhost:8000`; su chequeo de salud
   es `http://localhost:8000/api/health`.

2. En otra terminal, iniciar la tienda web:

   ```powershell
   cd frontend
   npm install
   npm run dev
   ```

   Copiá `.env.example` como `.env.local` si necesitás definir `VITE_API_URL`.

3. Para iniciar la app móvil:

   ```powershell
   cd mobile
   npm install
   npm start
   ```

   Configurá `EXPO_PUBLIC_API_URL` en `mobile/.env`. Para un teléfono en la red
   local, usá la IP de la PC; para producción, la URL HTTPS de la API.

## Despliegue

La arquitectura prevista es:

- **Web:** Netlify. Enlazá este repositorio y establecé `frontend` como
  directorio base, `npm run build` como comando y `dist` como directorio de
  publicación. Configurá `VITE_API_URL` con la URL HTTPS pública de la API.
- **API:** Vercel. Creá un proyecto desde el mismo repositorio y establecé
  `backend` como directorio raíz. El backend exporta la app de Express para que
  Vercel la ejecute como función. Configurá las variables de
  `backend/.env.example` en el panel del proyecto.
- **Base de datos:** Supabase PostgreSQL. `backend/prisma/schema.production.prisma`
  define el esquema de producción; configurá `DATABASE_URL` (pooler) y
  `DIRECT_URL` (conexión directa), luego ejecutá `npm run db:push:production`
  desde `backend`.
- **Imágenes:** Cloudinary. El backend usa almacenamiento en memoria para subir
  las imágenes a Cloudinary; no depende del disco efímero de Vercel.

Al crear el esquema de producción, la base empieza vacía: no se migran usuarios,
pedidos ni catálogo desde SQLite. Registrá una cuenta nueva y volvé a cargar los
productos desde la administración.

Generá `JWT_SECRET_KEY` con un valor largo, único y aleatorio. No uses la clave
de ejemplo, no publiques credenciales ni cargues secretos con el prefijo
`VITE_` o `EXPO_PUBLIC_`. `CORS_ORIGINS` debe contener el dominio exacto de
Netlify, sin barra final; los clientes móviles no envían un origen de navegador.
Tras desplegar, configurá la URL HTTPS de Vercel en `VITE_API_URL` en Netlify y
`EXPO_PUBLIC_API_URL` al compilar la app móvil.
