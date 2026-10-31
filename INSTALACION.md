# Cómo arrancar el proyecto

## Requisitos

- Java 21
- Node.js 20 o superior
- MySQL 8 en el puerto 3306 (vale el de XAMPP)

## 1. Base de datos

Importa `restaurante_qr.sql` en MySQL (por ejemplo, desde phpMyAdmin). Crea la base de datos `restaurante_qr` con datos de ejemplo.

## 2. Variables de entorno

```bash
cd backend
cp ../.env.example .env
```

Abre `backend/.env` y pon el usuario y la contraseña de tu MySQL. El backend lo lee solo al arrancar. El `.env` no se sube a Git.

## 3. Backend

```bash
cd backend
./mvnw spring-boot:run
```

La API queda en `http://localhost:8080`.

## 4. Frontend

```bash
cd frontend
npm install
npm run dev
```

Abre `http://localhost:5173`.

## Usuarios de prueba

Con los datos de ejemplo, todos tienen la contraseña `1234`:

| Rol | Email |
|---|---|
| Gerente | `gerente@test.es` |
| Camarero | `camarero1@test.es` |
| Cocina | `cocinero1@test.es` |

## Tests

```bash
cd backend
./mvnw test
```

## Imágenes

Las fotos de platos, cartas y empleados no vienen en el repositorio. Las que subas desde el panel se guardan en `backend/uploads/`.
