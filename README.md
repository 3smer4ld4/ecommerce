# TechStore – E-commerce

Aplicación web de comercio electrónico desarrollada con **Next.js** para el frontend y **Laravel** para el backend. Permite consultar productos, gestionar un carrito de compras, registrar usuarios, iniciar sesión, crear pedidos y realizar pagos mediante Stripe.

## Tecnologías utilizadas

### Frontend
- Next.js 16
- React 19
- TypeScript
- Tailwind CSS

### Backend
- Laravel 12
- PHP 8.2+
- SQLite
- Laravel Sanctum
- L5-Swagger
- Stripe

## Funcionalidades

- Catálogo de productos.
- Visualización de detalles de productos.
- Carrito de compras.
- Control de cantidades según el inventario disponible.
- Registro e inicio de sesión.
- Autenticación mediante tokens Sanctum.
- Creación y consulta de pedidos.
- Actualización automática del inventario.
- Integración de pagos con Stripe Checkout.
- Confirmación de pagos mediante webhooks.
- Documentación de API con Swagger.

## Estructura del proyecto

```text
ecommerce/
├── ecomerce-api/          # Backend Laravel
├── ecommerce-frontend/    # Frontend Next.js
├── .gitignore
└── README.md
```

## Requisitos

- PHP 8.2 o superior.
- Composer.
- Node.js y npm.
- Git.
- SQLite.
- Cuenta de Stripe para probar los pagos.

## Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/3smer4ld4/ecommerce.git
cd ecommerce
```

### 2. Configurar el backend

```bash
cd ecomerce-api
composer install
```

Crear el archivo `.env` a partir de `.env.example` y configurar la conexión SQLite y las credenciales necesarias.

Generar la clave de Laravel:

```bash
php artisan key:generate
```

Crear la base de datos SQLite en `database/database.sqlite` si todavía no existe.

Ejecutar las migraciones y los datos iniciales:

```bash
php artisan migrate --seed
```

Iniciar el servidor:

```bash
php artisan serve
```

El backend estará disponible en:

`http://127.0.0.1:8000`

### 3. Configurar el frontend

En otra terminal:

```bash
cd ecommerce-frontend
npm install
```

Crear el archivo `.env.local` con las siguientes variables:

```env
API_URL=http://127.0.0.1:8000/api
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api
```

Iniciar el frontend:

```bash
npm run dev
```

El frontend estará disponible en:

`http://localhost:3000`

## Pagos con Stripe

Para probar los pagos es necesario configurar las credenciales de Stripe en el backend y utilizar Stripe CLI para escuchar los eventos del webhook.

Ejemplo:

```bash
stripe listen --forward-to localhost:8000/api/stripe/webhook
```

Configurar el secreto del webhook proporcionado por Stripe CLI en el entorno del backend.

No publicar claves secretas ni credenciales reales.

## Documentación de la API

Con el backend en ejecución, la documentación Swagger está disponible en:

`http://127.0.0.1:8000/api/documentation`

## Principales endpoints

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/api/products` | Listar productos |
| GET | `/api/products/{id}` | Consultar producto |
| POST | `/api/register` | Registrar usuario |
| POST | `/api/login` | Iniciar sesión |
| POST | `/api/logout` | Cerrar sesión |
| GET | `/api/user` | Consultar usuario autenticado |
| POST | `/api/orders` | Crear pedido |
| GET | `/api/orders` | Consultar pedidos |
| POST | `/api/orders/{orderId}/checkout` | Crear sesión de pago |
| POST | `/api/stripe/webhook` | Recibir eventos de Stripe |

## Pruebas

Para ejecutar las pruebas del backend:

```bash
cd ecomerce-api
php artisan test
```

## Seguridad

- Los archivos `.env` y `.env.local` no deben subirse al repositorio.
- No compartir claves privadas de Stripe.
- La autenticación utiliza Laravel Sanctum.
- Los pagos se confirman mediante webhooks de Stripe.
