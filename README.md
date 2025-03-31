# Aplicación de Gestión de Productos

## Descripción Técnica

Esta aplicación es un sistema de gestión de productos construido con NestJS, siguiendo una arquitectura de microservicios. Consta de dos servicios principales:

1. **BFF de Gestión de Productos (Backend-For-Frontend)**: Actúa como puerta de enlace API que maneja las solicitudes del cliente y se comunica con el servicio backend.
2. **Backend de Gestión de Productos**: Servicio principal responsable de la lógica de negocio y operaciones de datos.

La aplicación utiliza las siguientes tecnologías:
- **NestJS**: Framework progresivo de Node.js para construir aplicaciones del lado del servidor eficientes y escalables
- **GraphQL**: Lenguaje de consulta API utilizando Apollo Server para la capa BFF
- **REST API**: Endpoints REST tradicionales para ciertas operaciones
- **PostgreSQL**: Base de datos principal usando Prisma como ORM
- **Redis**: Para caché y mejora del rendimiento
- **Kafka**: Broker de mensajes para comunicación asíncrona entre servicios
- **Docker**: Contenedorización para entornos de desarrollo y despliegue consistentes

## Diagrama de Arquitectura

```mermaid
graph TD
    Client[Aplicaciones Cliente\n(Web/Mobile)] <--> BFF[Product BFF\n(GraphQL/REST)]
    BFF <--> Backend[Backend de Gestión\nde Productos]
    BFF --> Redis[Redis Cache]
    Backend --> PostgreSQL[PostgreSQL DB]
    PostgreSQL --> Kafka[Kafka\nMessage Broker]
    
    classDef client fill:#f9f9f9,stroke:#333,stroke-width:1px;
    classDef service fill:#d9edf7,stroke:#31708f,stroke-width:1px;
    classDef database fill:#dff0d8,stroke:#3c763d,stroke-width:1px;
    classDef messaging fill:#fcf8e3,stroke:#8a6d3b,stroke-width:1px;
    
    class Client client;
    class BFF,Backend service;
    class Redis,PostgreSQL database;
    class Kafka messaging;
```

## Configuración del Entorno

### Prerequisitos
- Docker y Docker Compose
- Node.js (v18+)
- pnpm

### Configuración con Docker Compose

1. Clona el repositorio:
```bash
git clone https://github.com/your-username/deuna-app-challenge.git
cd deuna-app-challenge
```

2. Crea un archivo `.env` en el directorio raíz con las siguientes variables:
```
DATABASE_URL="postgresql://postgres:postgres@postgres:5432/product_management?schema=public"
REDIS_URL="redis://redis:6379"
KAFKA_BROKER="kafka:9092"
PORT=3000
BACKEND_SERVICE_URL="http://product-management-backend:3001"
```

3. Ejecuta Docker Compose:
```bash
docker compose up
```

Esto iniciará todos los servicios necesarios:
- Base de datos PostgreSQL
- Cache Redis
- Broker Kafka
- Servicio Backend de Gestión de Productos
- Servicio BFF de Gestión de Productos

### Configuración Manual (sin Docker)

1. Instala las dependencias:
```bash
pnpm install
```

2. Configura tus variables de entorno locales

3. Ejecuta las migraciones de la base de datos:
```bash
npx prisma migrate dev
```

4. Alimenta la base de datos:
```bash
npx prisma db seed
```

5. Inicia los servicios:
```bash
pnpm start:dev:backend
pnpm start:dev:bff
```

## Ejecución de Pruebas

### Pruebas Unitarias
```bash
# Ejecutar todas las pruebas unitarias
pnpm test

# Ejecutar pruebas en modo watch
pnpm test:watch

# Ejecutar pruebas con cobertura
pnpm test:cov
```

### Pruebas End-to-End
```bash
# Ejecutar todas las pruebas e2e
pnpm test:e2e

# Ejecutar solo pruebas e2e de backend
pnpm test:backend:e2e

# Ejecutar solo pruebas e2e de BFF
pnpm test:bff:e2e
```

### Depuración de Pruebas
```bash
pnpm test:debug
```

## Scripts Útiles

### Desarrollo
```bash
# Iniciar ambos servicios en modo desarrollo
pnpm start:dev

# Iniciar solo el backend en modo desarrollo
pnpm start:dev:backend

# Iniciar solo el BFF en modo desarrollo
pnpm start:dev:bff

# Iniciar servicios en modo debug
pnpm start:debug
pnpm start:debug:backend
pnpm start:debug:bff
```

### Gestión de Base de Datos
```bash
# Aplicar migraciones de base de datos
npx prisma migrate dev

# Generar cliente Prisma
npx prisma generate

# Alimentar la base de datos con datos iniciales
npx prisma db seed
```

### Calidad de Código
```bash
# Formatear código con prettier
pnpm format

# Ejecutar linting
pnpm lint
```

### Producción
```bash
# Construir la aplicación
pnpm build

# Iniciar en modo producción
pnpm start:prod
```

## Colección Postman

Se incluye una colección Postman en el repositorio para probar los endpoints API. Puedes importarla en tu aplicación Postman desde:

`/postman/Product-Management-API.postman_collection.json`

Para usar la colección:
1. Importa la colección en Postman
2. Configura un entorno con la variable `base_url` apuntando a tu endpoint API (predeterminado: http://localhost:3000)
3. Ejecuta las solicitudes

## Ejemplos de API

### Ejemplos de GraphQL

#### Consultar todos los productos
```graphql
query {
  products {
    id
    name
    price
    description
    stock
  }
}
```

#### Obtener producto por ID
```graphql
query {
  product(id: "1") {
    id
    name
    price
    description
    stock
  }
}
```

#### Crear nuevo producto
```graphql
mutation {
  createProduct(
    data: {
      name: "Nuevo Producto"
      price: 99.99
      description: "Descripción del producto"
      stock: 1
    }
  ) {
    id
    name
    price
  }
}
```

### Ejemplos de API REST

#### Obtener todos los productos
```bash
curl -X GET http://localhost:3000/api/products
```

#### Obtener producto por ID
```bash
curl -X GET http://localhost:3000/api/products/1
```

#### Crear nuevo producto
```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Nuevo Producto",
    "price": 99.99,
    "description": "Descripción del producto",
    "stock": 12
  }'
```

#### Actualizar producto
```bash
curl -X PUT http://localhost:3000/api/products/1 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Actualiado Producto",
    "price": 99.99,
    "description": "Descripción del producto",
    "stock": 12
  }'
```

#### Eliminar producto
```bash
curl -X DELETE http://localhost:3000/api/products/1
```
