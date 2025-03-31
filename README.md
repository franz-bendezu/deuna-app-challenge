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

Si no se visualiza lo puede aquí:
 [Diagrama de Arquitectura](./ARCHITECTURE.png)

```mermaid
graph TD
    classDef client fill:#f9f9f9,stroke:#333,stroke-width:2px;
    classDef service fill:#d9edf7,stroke:#31708f,stroke-width:2px;
    classDef database fill:#dff0d8,stroke:#3c763d,stroke-width:2px;
    classDef messaging fill:#fcf8e3,stroke:#8a6d3b,stroke-width:2px;
    classDef container fill:#f5f5f5,stroke:#555,stroke-width:2px,dashed;

    Client["fa:fa-mobile Aplicaciones Cliente (Web/Mobile)"] --> |GraphQL API| BFF["fa:fa-exchange BFF de Gestión de Productos"]
    BFF --> |REST API| Backend["fa:fa-cogs Backend de Gestión de Productos"]
    
    Backend -->|Cacheo de datos| Redis["fa:fa-bolt Redis (Cache)"]
    Backend -->|Consulta/Escritura| PostgreSQL["fa:fa-database PostgreSQL (Base de Datos)"]
    Backend -->|Envío de eventos| Kafka["fa:fa-paper-plane Kafka (Message Broker)"]
    Kafka --> Zookeeper["fa:fa-cogs Zookeeper (Para Kafka)"]
    Kafka --> KafkaUI["fa:fa-tachometer-alt Kafka UI"]

    class Client client;
    class BFF,Backend service;
    class Redis,PostgreSQL,Zookeeper database;
    class Kafka,KafkaUI messaging;

    subgraph BackendSystem["Core"]
        Backend
        Redis
        PostgreSQL
        Kafka
        Zookeeper
    end
    subgraph ClientSystem["Cliente"]
        Client
    end
    subgraph Monitoring["Monitoreo"]
        KafkaUI
    end
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

## Postman
A continuación se detalla cómo utilizar las colecciones Postman proporcionadas para probar la API de gestión de productos, los archivos se encuentran en la carpeta `postman` del proyecto.

### Colecciones

1. **Product-Management-BFF.postman_collection.json** - Para probar la API GraphQL del BFF
2. **Product-Management-Backend.postman_collection.json** - Para probar la API REST del Backend
3. **DeUna-Integration-Tests.postman_collection.json** - Pruebas de integración que cubren flujos completos entre BFF y Backend

### Configuración del entorno

La colección utiliza variables de entorno para facilitar las pruebas en diferentes ambientes. Se proporciona un archivo de entorno predeterminado:

- **DeUna-Environment.postman_environment.json**

### Variables de entorno

- `backend_url`: URL base para el servicio Backend (predeterminado: http://localhost:3000)
- `bff_url`: URL base para el servicio BFF (predeterminado: http://localhost:3001)


### Guía de uso

#### Importar las colecciones y el entorno

1. Abre Postman
2. Haz clic en "Import" en la esquina superior izquierda
3. Importa los 4 archivos JSON (colecciones y el entorno) haciendo clic en los seleccionados o arrastrnadolos.
4. Confirma la importación

#### Seleccionar el entorno

1. Debes seleccionar "DeUna Environment" del menú desplegable de entornos

#### Pruebas de la API BFF (GraphQL)

La colección BFF contiene solicitudes para:
- Obtener todos los productos
- Obtener un producto por ID
- Crear un nuevo producto
- Actualizar un producto existente
- Eliminar un producto

Todas las operaciones se realizan a través del endpoint `/graphql` utilizando diferentes queries y mutations.

#### Pruebas de la API Backend (REST)

La colección Backend contiene solicitudes para:
- Obtener todos los productos (GET /products)
- Obtener un producto por ID (GET /products/{id})
- Crear un nuevo producto (POST /products)
- Actualizar un producto (PUT /products/{id})
- Eliminar un producto (DELETE /products/{id})
- Acceder a la documentación Swagger (GET /swagger)

#### Ejecución de las pruebas de integración

La colección de pruebas de integración está diseñada para ejecutarse secuencialmente y validar que:
1. Se pueda crear un producto en el Backend
2. El producto sea accesible desde el BFF
3. Se pueda actualizar el producto desde el BFF
4. Los cambios se reflejen en el Backend
5. Se pueda eliminar el producto desde el Backend
6. El BFF reporte correctamente que el producto ya no existe

Para ejecutar todas las pruebas:
1. Abre la colección "DeUna Integration Tests"
2. Haz clic en los tres puntos (...) junto a "Flujo Completo de Producto"
3. Selecciona "Run"
4. Haz clic en "Run Flujo Completo de Producto"

### Notas adicionales

- Las colecciones incluyen pruebas automatizadas (con scripts de test) que validan las respuestas
- Algunas solicitudes almacenan automáticamente datos (como IDs) en variables para usarlos en solicitudes posteriores
- Las colecciones están documentadas con descripciones detalladas para cada solicitud


## Ejemplos

### Ejemplos de BBF (GraphQL)

#### Consultar todos los productos
```graphql
{
  products {
    id
    name
    description
    price
    stock
    createdAt
    updatedAt
  }
}
```

#### Obtener producto por ID
```graphql
{
  product(id: "1") {
    id
    name
    description
    price
    stock
    createdAt
    updatedAt
  }
}
```

#### Crear nuevo producto
```graphql
mutation {
  createProduct(input: {
    name: "Nuevo Producto",
    description: "Descripción del nuevo producto",
    price: 99.99,
    stock: 50
  }) {
    id
    name
    description
    price
    stock
    createdAt
    updatedAt
  }
}
```

#### Actualizar producto
```graphql
mutation {
  updateProduct(
    id: "1", 
    input: {
      name: "Producto Actualizado",
      price: 129.99
    }
  ) {
    id
    name
    description
    price
    stock
    createdAt
    updatedAt
  }
}
```

#### Eliminar producto
```graphql
mutation {
  deleteProduct(id: "1")
}
```

### Ejemplos de Backend (REST API)

#### Obtener todos los productos
```bash
curl -X GET http://localhost:3000/products
```

#### Obtener producto por ID
```bash
curl -X GET http://localhost:3000/products/1
```

#### Crear nuevo producto
```bash
curl -X POST http://localhost:3000/products \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Nuevo Producto",
    "descripcion": "Descripción detallada del producto",
    "precio": 99.99,
    "stock": 100
  }'
```

#### Actualizar producto
```bash
curl -X PUT http://localhost:3000/products/1 \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Producto Actualizado",
    "descripcion": "Descripción actualizada",
    "precio": 149.99,
    "stock": 75
  }'
```

#### Eliminar producto
```bash
curl -X DELETE http://localhost:3000/products/1
```

## Formatos de datos

### Backend REST API (Product DTO)
```json
{
  "id": "1",
  "nombre": "Producto de ejemplo",
  "descripcion": "Descripción detallada del producto",
  "precio": 99.99,
  "stock": 100,
  "fechaCreacion": "2023-06-15T10:30:00Z",
  "fechaActualizacion": "2023-06-15T10:30:00Z"
}
```

### BFF GraphQL API (Product DTO)
```json
{
  "id": "1",
  "name": "Producto de ejemplo",
  "description": "Descripción detallada del producto",
  "price": 99.99,
  "stock": 100,
  "createdAt": "2023-06-15T10:30:00Z",
  "updatedAt": "2023-06-15T10:30:00Z"
}
```
