# Frontend ampliado

Esta copia conserva las mismas páginas y llamadas a la API que `frontend`, pero incorpora herramientas adicionales para compararlas:

- TanStack Query para cargar y actualizar datos del backend.
- Zustand para el carrito global.
- React Hook Form y Zod para formularios y validaciones.

`frontend` es la variante sencilla con React y Context. Esta carpeta es solo una copia de comparación; cada una tiene sus propias dependencias.

Para ejecutar esta versión, desde esta carpeta:

```sh
npm run dev
```

Usa `VITE_API_URL` de `.env.local`, igual que el frontend original.