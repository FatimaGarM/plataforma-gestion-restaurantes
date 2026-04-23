# gestion-restaurante-qr
Aplicación web para gestión de pedidos en restaurantes mediante código QR
Los clientes pueden acceder a la carta desde su móvil sin necesidad de registro,
realizar pedidos y efectuar pagos, mientras que el personal del restaurante
(camareros, cocina y gerente) puede gestionar los pedidos desde distintos paneles.

## Funcionalidades principales
- Acceso a la carta mediante código QR por mesa
- Realización de pedidos sin necesidad de login
- Pago individual o total 
- Visualización del estado del pedido
- Panel de camarero y cocina para gestión de pedidos
- Panel de gerente para gestión de carta, productos, empleados y estadísticas

## Tecnologías utilizadas
### Frontend
- React
- Tailwind CSS
- HTML5
- CSS
- JavaScript

### Backend
- Java
- Spring Boot
- API REST

### Base de datos
- MySQL

### Otras herramientas
- Git y GitHub
- Figma (diseño de interfaces)
- Draw.io (diagramas)

## Requisitos previos
- Java 17+
- Node.js 18+
- MySQL (XAMPP o similar) en el puerto 3306
- Maven (incluido en el proyecto con `mvnw`)

## Instalación y ejecución

### 1. Base de datos
Importar el archivo `restaurante_qr.sql` en MySQL (por ejemplo desde phpMyAdmin).

### 2. Backend (Spring Boot)
```bash
cd backend
./mvnw spring-boot:run
```
El servidor arranca en `http://localhost:8080`.

> **Primer arranque:** `DataInitializer` detecta automáticamente contraseñas corruptas en la BD y las resetea a `1234`. Los mensajes `[DataInitializer] Contraseña corregida para: xxx@xxx.com` en los logs confirman que se ha ejecutado.

### 3. Frontend (React + Vite)
```bash
cd frontend
npm install
npm run dev
```
La aplicación queda disponible en `http://localhost:5173` (o el siguiente puerto libre).

## Credenciales por defecto
| Rol | Email | Contraseña |
|---|---|---|
| Gerente | gerente@test.es | 1234 |
| Gerente (admin) | admin@test.es | 1234 |
| Camarero | camarero1@test.es | 1234 |
| Camarero | camarero2@test.es | 1234 |
| Cocinero | cocinero1@test.es | 1234 |
| Cocinero | cocinero2@test.es | 1234 |

> Las contraseñas se pueden cambiar desde el panel (icono de usuario → *Cambiar contraseña*).

## Seguridad
La API usa **HTTP Basic Auth**. Cada petición del frontend incluye el header `Authorization: Basic <base64(email:password)>` guardado en `localStorage` al hacer login. Los endpoints están protegidos por rol:
- **GERENTE**: acceso total
- **CAMARERO / COCINERO**: pedidos, servicios, consulta de carta, cambio de propia contraseña
- **Sin autenticar**: solo `/uploads/**` (imágenes de la carta QR pública)

## Estado del proyecto
Proyecto en desarrollo

## Desarrollado por

- Luis Martín Benítez  
- Fátima García Muriana  

Proyecto Intermodular 
Ciclo Formativo: Desarrollo de Aplicaciones Web  
Curso académico: 2025/2026
