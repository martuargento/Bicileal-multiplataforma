# Bicileal Mobile

Aplicación nativa de Bicileal desarrollada con React Native y Expo. Conserva los nombres de pantallas y funciones en español y usa el backend Node que ya existe en `../backend`.

## Requisitos

- Node.js LTS y npm.
- El backend Node instalado y funcionando en el puerto `8000`.
- Para probar en un celular Android: Expo Go instalado y la PC y el celular conectados a la misma red Wi-Fi.
- Para el emulador Android: Android Studio y un emulador configurado. No hace falta Android Studio si usás Expo Go en un teléfono.

## Configurar la conexión al backend

La app lee la URL desde `EXPO_PUBLIC_API_URL`. Copiá `.env.example` como `.env` en esta carpeta y elegí la URL según dónde se ejecute:

| Dispositivo | URL |
| --- | --- |
| Emulador Android | `http://10.0.2.2:8000` |
| Simulador iOS | `http://localhost:8000` |
| Celular físico | `http://IP_LOCAL_DE_TU_PC:8000` |

Para encontrar la IP local en Windows, ejecutá `ipconfig` y usá la dirección IPv4 de tu conexión Wi-Fi, por ejemplo `http://192.168.1.25:8000`. No uses `localhost` desde un celular físico: apuntaría al propio teléfono. Permití Node.js en el firewall de Windows si el teléfono no puede acceder al servidor.

El backend escucha en todas las interfaces de red. Desde la raíz del proyecto, iniciálo en una terminal:

```powershell
cd backend
npm run dev
```

Comprobá que responde abriendo `http://localhost:8000/api/health` en la PC.

## Ejecutar con Expo Go (recomendado para empezar)

En otra terminal:

```powershell
cd mobile
npm install
npm start
```

Escaneá el QR que muestra Expo con Expo Go. Si estás en una red que bloquea la conexión local, ejecutá `npx expo start --tunnel` (la conexión al backend seguirá necesitando que el teléfono alcance la IP de tu PC).

Para abrir directamente un emulador Android con Android Studio instalado:

```powershell
npm run android
```

La primera vez que cambies `.env`, reiniciá Expo con `npx expo start --clear`.

## Qué probar

1. Abrí **Tienda**, comprobá que carga el catálogo del backend y agregá productos.
2. Entrá a **Carrito**, ajustá cantidades y cerrá/volvé a abrir la app para comprobar que se conserva.
3. En **Cuenta**, creá un usuario o iniciá sesión; volvé al carrito y confirmá un pedido.
4. Revisá el pedido en **Mis pedidos** y abrí **Administrar productos** para crear, editar o eliminar un producto.
5. Probá **Nuestra historia** y **Contacto** desde los accesos del encabezado.

El registro de pedidos reproduce el comportamiento del backend actual: registra el total y el usuario asociado. El formulario de contacto valida los datos localmente, igual que la versión web actual; todavía no existe un endpoint de contacto en el backend.

## Estructura

- `src/api/`: cliente HTTP y funciones de autenticación, productos, pedidos y cotización.
- `src/components/`: controles y componentes de interfaz reutilizables.
- `src/context/`: sesión y carrito persistentes.
- `src/navigation/`: navegación inferior y pantallas apiladas.
- `src/screens/`: pantallas de la aplicación.
- `src/theme/` y `src/utils/`: colores y formato compartidos.
