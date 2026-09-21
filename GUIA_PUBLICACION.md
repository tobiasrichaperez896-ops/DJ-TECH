# Publicar DJ TECH

DJ TECH tiene dos partes que se publican por separado:

1. Frontend estatico: los archivos HTML, CSS y JavaScript.
2. Backend Node.js: Groq, pedidos y Gmail SMTP.

## Opcion simple para empezar

### Frontend

Podés subir la carpeta del proyecto a Netlify, Vercel o GitHub Pages.

Para una prueba local:

```powershell
python -m http.server 8000
```

### Backend

El backend necesita un servidor que ejecute Node.js, por ejemplo Render, Railway, Fly.io o un VPS.

Comando de inicio:

```powershell
npm install
node backend/server.js
```

En el hosting del backend hay que configurar estas variables en el panel de Environment Variables:

```env
PORT=3000
FRONTEND_ORIGIN=https://TU-DOMINIO-FRONTEND
ADMIN_EMAIL=tu-correo
ORDER_FORWARD_URL=
GROQ_API_KEY=tu-clave-privada
GROQ_MODEL=openai/gpt-oss-20b
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=tu-correo
SMTP_PASS=tu-contrasena-de-aplicacion
```

No subas `backend/.env` al repositorio.

## Cambiar la URL del backend

Antes de publicar el frontend, abrí `site-config.js` y cambiá las tres URLs locales:

```javascript
orderEndpoint: 'https://TU-BACKEND/api/order',
smartSearchEndpoint: 'https://TU-BACKEND/api/smart-search',
recommendationEndpoint: 'https://TU-BACKEND/api/recommendations'
```

Mientras esas URLs sigan apuntando a `127.0.0.1`, la web publicada no podrá comunicarse con tu computadora.

## Orden recomendado

1. Publicar primero el backend.
2. Probar `https://TU-BACKEND/api/health`.
3. Probar Groq desde el backend.
4. Cambiar las URLs en `site-config.js`.
5. Publicar el frontend.
6. Probar catálogo, carrito, recomendador y pedido desde el dominio público.

## Importante sobre Gmail

`SMTP_PASS` debe ser una contraseña de aplicación de Google. No uses tu contraseña normal y no la pongas en HTML, JavaScript ni en un repositorio público.

## Importante sobre imágenes

Las imágenes actuales vienen de URLs externas. Para una tienda real conviene guardar imágenes propias en un CDN o servicio de almacenamiento y reemplazar las URLs en `products.js`.

## Comprobaciones finales

- La portada carga en celular.
- La navegación móvil aparece y se puede desplazar horizontalmente.
- El catálogo no desborda el ancho.
- El carrito conserva productos.
- `/api/health` responde correctamente.
- La búsqueda inteligente funciona desde el dominio publicado.
- El pedido llega al correo configurado.
