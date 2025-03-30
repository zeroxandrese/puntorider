Backend con Node.js, Express, MongoDB y Prisma 🚀

Este proyecto es un backend desarrollado con Node.js y Express, utilizando MongoDB como base de datos principal y Prisma como ORM. También se emplea Redis para optimización y manejo de caché. La gestión de paquetes se realiza con pnpm.

🚀 Características

CRUD completo para gestionar datos.

Integración con Prisma para interactuar con MongoDB.

Caching eficiente con Redis.

Gestión de paquetes rápida y eficiente con pnpm.

🛠️ Tecnologías Utilizadas

Node.js - Entorno de ejecución de JavaScript.

Express - Framework para crear el servidor.

MongoDB - Base de datos NoSQL.

Prisma - ORM para interactuar con MongoDB.

Redis - Caché en memoria para mejorar el rendimiento.

pnpm - Gestión de paquetes rápida y eficiente.

📦 Instalación

Instala las dependencias:

 pnpm install

Configura las variables de entorno en un archivo .env:

Ejecuta las migraciones de Prisma:

pnpm prisma db push

🚀 Ejecución del Proyecto

Desarrollo:

pnpm run dev

Producción:

pnpm run build
pnpm start

📁 Estructura del Proyecto

/src
  ├── controllers
  ├── models
  ├── routes
  ├── services
  └── utils

📄 Licencia

Este proyecto está bajo la licencia MIT.