# Integraciones DJ TECH

Este backend opcional mantiene las claves fuera del frontend.

## Configuración

1. Copiá `.env.example` como `.env`.
2. Definí `ADMIN_EMAIL` y `ORDER_FORWARD_URL` según el proveedor de correo que elijas.
3. Definí `GROQ_API_KEY` solo si vas a habilitar búsqueda inteligente o recomendaciones con Groq. La clave debe vivir únicamente en `backend/.env`.
4. En `site-config.js`, apuntá `orderEndpoint`, `smartSearchEndpoint` y `recommendationEndpoint` a este servidor.
5. Ejecutá `node backend/server.js`.

`ADMIN_EMAIL` puede ser `cocacolau74@gmail.com`. `ORDER_FORWARD_URL` debe ser un endpoint propio o de un proveedor de correo, no una dirección de email. Como alternativa, el backend soporta Gmail SMTP con `SMTP_USER` y `SMTP_PASS`; `SMTP_PASS` debe ser una contraseña de aplicación de Google, nunca la contraseña normal. Mientras SMTP y `ORDER_FORWARD_URL` estén vacíos, el frontend usa `mailto:` como respaldo.

Los endpoints de IA reciben el catálogo real y solo pueden devolver criterios o IDs existentes. El frontend mantiene una búsqueda local y un recomendador local como fallback.
