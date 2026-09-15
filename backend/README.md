# 🛒 Backend E-commerce — BookWise API

API REST para un e-commerce de libros construida con **Node.js + Express**. Soporta dos modos de persistencia intercambiables: **MongoDB** (por defecto) y **File System**.

---

## 🚀 Tecnologías

| Paquete | Versión | Uso |
|---|---|---|
| Express | ^4.19.2 | Framework HTTP |
| Mongoose | ^8.4.0 | ODM para MongoDB |
| Socket.io | ^4.8.3 | Eventos en tiempo real |
| Express-Handlebars | ^9.0.1 | Motor de vistas |
| Joi | ^17.13.1 | Validación de esquemas |
| dotenv | ^16.4.5 | Variables de entorno |
| minimist | ^1.2.8 | Argumentos CLI |
| cors | ^2.8.5 | CORS middleware |
| nodemon | ^3.1.3 | Recarga en desarrollo |

---

## 📁 Estructura del proyecto

```
backend/
├── config.js                   # Configuración global (modo, puerto, MongoDB URI)
├── .env                        # Variables de entorno (no subir a Git)
├── data/
│   ├── products.json           # Datos persistidos en modo FS
│   └── carts.json
└── src/
    ├── app.js                  # Entry point (Express + Socket.io + Handlebars)
    ├── db/
    │   └── mongo.js            # Conexión a MongoDB
    ├── controllers/
    │   ├── products.js         # Lógica de productos
    │   └── cart.js             # Lógica de carritos
    ├── middlewares/
    │   ├── error.middleware.js # Manejo centralizado de errores
    │   └── validate.middleware.js  # Validación con Joi
    ├── models/
    │   ├── DAOs/
    │   │   ├── BaseDAO.js      # Interfaz base
    │   │   ├── MongoDAO.js     # Implementación MongoDB
    │   │   ├── FileSystemDAO.js # Implementación File System
    │   │   └── index.js        # Factory: selecciona DAO según el modo
    │   ├── DTOs/
    │   │   └── index.js        # Transformadores de respuesta
    │   ├── model/
    │   │   ├── Product.js      # Modelo Mongoose de Producto
    │   │   └── Cart.js         # Modelo Mongoose de Carrito
    │   └── schemas/
    │       └── index.js        # Esquemas Joi de validación
    ├── router/
    │   ├── index.js            # Router principal (/api)
    │   ├── products.router.js  # Rutas de productos
    │   ├── cart.router.js      # Rutas de carritos
    │   └── views.router.js     # Rutas de vistas Handlebars
    ├── utils/
    │   ├── ApiError.js         # Clase de error personalizada
    │   └── catchAsync.js       # Wrapper para manejo async/await
    └── views/
        ├── products.handlebars
        ├── product-detail.handlebars
        ├── cart.handlebars
        ├── layouts/
        │   └── main.handlebars
        └── partials/
```

---

## ⚙️ Instalación

### Requisitos previos

- Node.js >= 18
- MongoDB (solo en modo `mongo`)

### Pasos

```bash
# 1. Clonar el repositorio
git clone <url-del-repo>
cd backend

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env
# Editar .env con tus valores
```

---

## 🔧 Variables de entorno

Crear un archivo `.env` en la raíz del proyecto basándose en `.env.example`:

```env
# Servidor
PORT=8080
MODE=mongo          # "mongo" | "fs"

# MongoDB
MONGO_URI=mongodb://localhost:27017/ecommerce

# JWT (para futura autenticación)
JWT_SECRET=replace_with_a_strong_secret
JWT_EXPIRES_IN=24h

# SendGrid (para futuros emails)
SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxxxxxx
SENDGRID_FROM=no-reply@bookwise.com

# CORS
CLIENT_URL=http://localhost:5173
```

---

## ▶️ Scripts disponibles

```bash
# Producción
npm start

# Desarrollo con MongoDB (hot reload)
npm run dev

# Desarrollo con File System (hot reload)
npm run dev:fs
```

---

## 💾 Modos de persistencia

El proyecto implementa el patrón **DAO (Data Access Object)** con dos implementaciones intercambiables:

| Modo | Comando | Descripción |
|---|---|---|
| `mongo` | `npm run dev` | Persiste en MongoDB usando Mongoose |
| `fs` | `npm run dev:fs` | Persiste en archivos JSON dentro de `/data` |

El modo también puede setearse con la variable de entorno `MODE=fs`.

---

## 📡 API Endpoints

Base URL: `http://localhost:8080/api`

### Productos — `/api/products`

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/api/products` | Listar productos (con paginación, filtros y ordenamiento) |
| `GET` | `/api/products/:pid` | Obtener producto por ID |
| `POST` | `/api/products` | Crear producto |
| `PUT` | `/api/products/:pid` | Actualizar producto |
| `DELETE` | `/api/products/:pid` | Eliminar producto |

#### Query params de `GET /api/products`

| Param | Tipo | Descripción |
|---|---|---|
| `limit` | `number` | Cantidad de resultados por página (default: `10`) |
| `page` | `number` | Número de página (default: `1`) |
| `query` | `string` | Filtro por categoría o `status=true`/`status=false` |
| `sort` | `string` | Ordenar por precio: `asc` o `desc` |

#### Categorías válidas

`ficcion` · `no-ficcion` · `ciencia-tecnologia` · `desarrollo-personal` · `infantil-juvenil` · `poesia` · `ebooks`

#### Body para crear producto (`POST`)

```json
{
  "title": "El nombre del viento",
  "description": "Primera parte de la Crónica del Asesino de Reyes.",
  "code": "ENV-001",
  "price": 1500,
  "stock": 20,
  "category": "ficcion",
  "status": true,
  "thumbnails": ["https://example.com/imagen.jpg"]
}
```

---

### Carritos — `/api/carts`

| Método | Ruta | Descripción |
|---|---|---|
| `POST` | `/api/carts` | Crear carrito vacío |
| `GET` | `/api/carts/:cid` | Obtener carrito con productos populados |
| `POST` | `/api/carts/:cid/products/:pid` | Agregar producto (o incrementar cantidad) |
| `PUT` | `/api/carts/:cid/products/:pid` | Actualizar cantidad de un producto |
| `DELETE` | `/api/carts/:cid/products/:pid` | Eliminar producto del carrito |
| `PUT` | `/api/carts/:cid` | Reemplazar todos los productos del carrito |
| `DELETE` | `/api/carts/:cid` | Vaciar carrito |

---

## 🖥️ Vistas

El servidor incluye vistas renderizadas con **Handlebars** accesibles desde el navegador:

| Ruta | Vista |
|---|---|
| `/products` | Listado de productos |
| `/products/:pid` | Detalle de producto |
| `/carts/:cid` | Vista del carrito |

---

## 🔌 WebSocket (Socket.io)

El servidor emite eventos en tiempo real cuando se modifican productos:

| Evento | Cuándo se emite |
|---|---|
| `product:created` | Al crear un producto (`POST /api/products`) |
| `product:updated` | Al actualizar un producto (`PUT /api/products/:pid`) |
| `product:deleted` | Al eliminar un producto (`DELETE /api/products/:pid`) |

---

## 🧩 Formato de respuesta

Las respuestas de la API siguen una estructura consistente:

```json
{
  "status": "success",
  "payload": [...],
  "totalPages": 5,
  "page": 1,
  "hasPrevPage": false,
  "hasNextPage": true,
  "prevLink": null,
  "nextLink": "/api/products?limit=10&page=2"
}
```

Los errores devuelven:

```json
{
  "status": "error",
  "message": "Descripción del error"
}
```

---

## 📄 Licencia

ISC
