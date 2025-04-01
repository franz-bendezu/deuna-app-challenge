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

### Métodos de Configuración

Esta aplicación ofrece dos métodos de configuración para adaptarse a diferentes flujos de trabajo:

| Método | Caso de uso | Ventajas | Configuración |
|--------|-------------|----------|---------------|
| **Docker Compose (Prod)** | Producción, CI/CD | Entorno completo aislado | `docker compose up` |
| **Docker Compose (Local)** | Desarrollo local | Infraestructura dockerizada + servicios locales | `docker compose -f docker-compose.local.yml up` |

### 1. Configuración con Docker Compose (Producción)

Este método inicia **todos** los servicios en contenedores Docker, ideal para entornos de producción o pruebas.

```bash
# Clonar el repositorio
git clone https://github.com/franz-bendezu/deuna-app-challenge.git
cd deuna-app-challenge

# Configurar variables de entorno
cp .env.example .env
# Editar .env según necesidades

# Ejecutar todos los servicios
docker compose up
```

Con esta configuración:
- Los servicios se ejecutan en contenedores aislados
- Las redes están configuradas internamente
- No es necesario instalar dependencias localmente

### 2. Configuración con Docker Compose (Desarrollo Local)

Este método inicia solo los servicios de infraestructura en Docker, mientras que los servicios de aplicación se ejecutan localmente para facilitar el desarrollo.

```bash
# Clonar el repositorio e instalar dependencias
git clone https://github.com/franz-bendezu/deuna-app-challenge.git
cd deuna-app-challenge
pnpm install

# Configurar variables de entorno para desarrollo local
cp .env.example .env
# Modificar .env con los siguientes valores:
# DATABASE_URL="postgresql://postgres:postgres@localhost:5432/products_db?schema=public"
# BACKEND_PORT=3000
# BFF_PORT=3001
# BACKEND_URL="http://localhost:3000"

# Iniciar servicios de infraestructura
docker compose -f docker-compose.local.yml up -d

# Ejecutar migraciones de base de datos
npx prisma generate
npx prisma migrate dev
npx prisma db seed

# Iniciar servicios en terminales separadas
pnpm start:dev:backend  # Terminal 1 (Puerto 3000)
pnpm start:dev:bff      # Terminal 2 (Puerto 3001)
```

Con esta configuración:
- Solo PostgreSQL, Redis y Kafka se ejecutan en Docker
- Los servicios de aplicación se ejecutan localmente con hot-reload
  - Backend en puerto 3000
  - BFF en puerto 3001
- Facilita el desarrollo y la depuración

## Configuración de Variables de Entorno

Las variables de entorno son esenciales para la configuración del sistema. El proyecto utiliza un archivo `.env` para gestionar estas variables.

### Guía de Configuración

1. **Crear archivo .env**: Copia el archivo de ejemplo y personalízalo según tu entorno:
   ```bash
   cp .env.example .env
   ```

2. **Configuración por entorno**: Ajusta los valores según el método de configuración elegido:

   | Variable | Producción (Docker) | Desarrollo Local (Docker) |
   |----------|---------------------|---------------------------|
   | `DB_HOST` | db | localhost |
   | `DATABASE_URL` | postgresql://postgres:postgres@db:5432/products_db | postgresql://postgres:postgres@localhost:5432/products_db |
   | `REDIS_URL` | redis://redis:6379 | redis://localhost:6379 |
   | `KAFKA_BROKERS` | kafka:9092 | localhost:9092 |
   | `BACKEND_URL` | http://backend:3000 | http://localhost:3000 |

3. **Variables principales**:

   **Base de Datos**
   - `DB_PASSWORD`: Contraseña de PostgreSQL
   - `DB_USER`: Usuario de PostgreSQL
   - `DB_NAME`: Nombre de la base de datos
   - `DB_HOST`: Host de PostgreSQL
   - `DB_PORT`: Puerto de PostgreSQL (normalmente 5432)
   - `DATABASE_URL`: URL de conexión completa para Prisma

   **Servicios**
   - `BACKEND_PORT`: Puerto del servicio backend (normalmente 3000)
   - `BFF_PORT`: Puerto del servicio BFF (normalmente 3001)
   - `NODE_ENV`: Entorno (development, production)
   - `BACKEND_URL`: URL del servicio backend para que BFF se conecte

   **Cacheo y Mensajería**
   - `REDIS_URL`: URL de conexión a Redis
   - `REDIS_TTL`: Tiempo de vida para la caché (ms)
   - `KAFKA_BROKERS`: Lista de brokers de Kafka
   - `KAFKA_CLIENT_ID`: ID de cliente para Kafka

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
# Iniciar todos los servicios en modo desarrollo
pnpm start:dev

# Iniciar servicios individualmente
pnpm start:dev:backend  # Solo backend
pnpm start:dev:bff      # Solo BFF

# Iniciar en modo depuración
pnpm start:debug        # Todos los servicios
pnpm start:debug:backend
pnpm start:debug:bff
```

### Gestión de Base de Datos
```bash
# Generar cliente Prisma basado en schema
npx prisma generate

# Aplicar migraciones pendientes
npx prisma migrate dev

# Reiniciar base de datos y aplicar todo
npx prisma migrate reset

# Cargar datos iniciales
npx prisma db seed

# Ver datos en interfaz web
npx prisma studio
```

### Calidad de Código
```bash
# Formatear código
pnpm format

# Ejecutar linter
pnpm lint

# Ejecutar pruebas
pnpm test           # Todas las pruebas
pnpm test:e2e       # Pruebas end-to-end
```

### Producción
```bash
# Construir aplicación
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

La colección BFF contiene operaciones GraphQL para:

- Consultas (Queries):
  - `productos`: Obtener todos los productos
  - `producto`: Obtener un producto por ID

- Mutaciones (Mutations):
  - `crearProducto`: Crear un nuevo producto
  - `actualizarProducto`: Actualizar un producto existente
  - `eliminarProducto`: Eliminar un producto

#### Pruebas de la API Backend (REST)

La colección Backend contiene solicitudes para:
- Obtener todos los productos (GET /productos)
- Obtener un producto por ID (GET /productos/{id})
- Crear un nuevo producto (POST /productos)
- Actualizar un producto (PUT /productos/{id})
- Actualizar un producto parcialmente (PATCH /productos/{id})
- Eliminar un producto (DELETE /productos/{id})
- Acceder a la documentación Swagger (GET /swagger)

#### Ejecución de las pruebas de integración

La colección de pruebas de integración está diseñada para ejecutarse secuencialmente y validar que:
1. Se pueda crear un producto en el Backend
2. El producto sea accesible desde el BFF
3. Se pueda actualizar el producto desde el BFF
4. Se pueda actualizar parcialmente el producto desde el BFF
5. Los cambios se reflejen en el Backend
6. Se pueda eliminar el producto desde el Backend
7. El BFF reporte correctamente que el producto ya no existe

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
  productos {
    id
    nombre
    descripcion
    precio
    stock
    fechaCreacion
    fechaActualizacion
  }
}
```

#### Obtener producto por ID
```graphql
{
  producto(id: "1") {
    id
    nombre
    descripcion
    precio
    stock
    fechaCreacion
    fechaActualizacion
  }
}
```

#### Crear nuevo producto
```graphql
mutation {
  crearProducto(input: {
    nombre: "Nuevo Producto",
    descripcion: "Descripción del nuevo producto",
    precio: 99.99,
    stock: 50
  }) {
    id
    nombre
    descripcion
    precio
    stock
    fechaCreacion
    fechaActualizacion
  }
}
```

#### Actualizar producto
```graphql
mutation {
  actualizarProducto(
    id: "1", 
    input: {
      nombre: "Producto Actualizado",
      precio: 129.99
    }
  ) {
    id
    nombre
    descripcion
    precio
    stock
    fechaCreacion
    fechaActualizacion
  }
}
```

#### Eliminar producto
```graphql
mutation {
  eliminarProducto(id: "1")
}
```

### Ejemplos de Backend (REST API)

#### Obtener todos los productos
```bash
curl -X GET http://localhost:3000/productos
```

#### Obtener producto por ID
```bash
curl -X GET http://localhost:3000/productos/1
```

#### Crear nuevo producto
```bash
curl -X POST http://localhost:3000/productos \
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
curl -X PUT http://localhost:3000/productos/1 \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Producto Actualizado",
    "descripcion": "Descripción actualizada",
    "precio": 149.99,
    "stock": 75
  }'
```

#### Actualizar producto parcialmente
```bash
curl -X PATCH http://localhost:3000/productos/1 \
  -H "Content-Type: application/json" \
  -d '{
    "precio": 129.99,
    "stock": 75
  }'
```

#### Eliminar producto
```bash
curl -X DELETE http://localhost:3000/productos/1
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
  "nombre": "Producto de ejemplo",
  "descripcion": "Descripción detallada del producto",
  "precio": 99.99,
  "stock": 100,
  "fechaCreacion": "2023-06-15T10:30:00Z",
  "fechaActualizacion": "2023-06-15T10:30:00Z"
}
```
