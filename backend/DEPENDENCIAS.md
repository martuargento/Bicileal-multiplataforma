
cd "C:\Practica Programacion\Bicicletas-React-Node\backend"
npm ci
npx prisma generate
npm run dev
```

`npm ci` instala todas las dependencias declaradas en `package-lock.json`, incluyendo `nodemon`, Prisma, Express, JWT, bcrypt, CORS, Multer y Morgan.

Si `npm ci` falla porque el `package-lock.json` no coincide con `package.json`, usar una vez:

```powershell
npm install
npx prisma generate
npm run dev
```

## Dependencias principales

### Produccion

- `express`: servidor HTTP y rutas.
- `@prisma/client`: acceso a la base de datos desde el codigo.
- `prisma`: CLI y herramientas para el esquema SQLite.
- `bcryptjs`: hash y verificacion de contrasenas.
- `jsonwebtoken`: generacion y validacion de JWT.
- `cors`: permite peticiones desde el frontend.
- `multer`: subida de imagenes.
- `morgan`: logs de peticiones.
- `dotenv`: carga variables desde `.env`.

### Desarrollo

- `nodemon`: reinicia el servidor cuando cambia el codigo.

## Base de datos

El proyecto usa SQLite mediante Prisma. 