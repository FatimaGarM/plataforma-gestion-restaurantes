-- ============================================
-- BASE DE DATOS - GESTIÓN RESTAURANTE QR
-- ============================================

CREATE DATABASE IF NOT EXISTS restaurante_qr;
USE restaurante_qr;

-- BORRADO ORDENADO (por claves foráneas)
DROP TABLE IF EXISTS pedido;
DROP TABLE IF EXISTS servicio;
DROP TABLE IF EXISTS empleado;
DROP TABLE IF EXISTS plato;

-- ============================================
-- TABLA EMPLEADO
-- ============================================

CREATE TABLE empleado (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    contraseña VARCHAR(255),
    imagen VARCHAR(255),
    tipo_empleado VARCHAR(50),
    estado VARCHAR(50)
);

-- ============================================
-- TABLA PLATO
-- ============================================

CREATE TABLE plato (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255),
    descripcion TEXT,
    precio DOUBLE,
    imagen VARCHAR(255),
    tipo VARCHAR(50),
    disponible BOOLEAN
);

-- ============================================
-- TABLA SERVICIO
-- ============================================

CREATE TABLE servicio (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    estado VARCHAR(50),
    mesa INT
);

-- ============================================
-- TABLA PEDIDO
-- ============================================

CREATE TABLE pedido (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    mesa INT,
    estado VARCHAR(50),
    fecha_hora DATETIME DEFAULT CURRENT_TIMESTAMP,

    plato_id BIGINT,
    servicio_id BIGINT,

    CONSTRAINT fk_pedido_plato
        FOREIGN KEY (plato_id) REFERENCES plato(id)
        ON DELETE SET NULL,

    CONSTRAINT fk_pedido_servicio
        FOREIGN KEY (servicio_id) REFERENCES servicio(id)
        ON DELETE CASCADE
);

-- ============================================
-- DATOS DE EMPLEADOS (ENUMS CORRECTOS)
-- ============================================

INSERT INTO empleado (nombre, email, contraseña, imagen, tipo_empleado, estado)
VALUES
('Gerente', 'gerente@test.com', '$2a$10$Dow1QyGJ0v7FpC18JNpDne6N9KuX3sX5Yucs5cjox96D65gis6pZe', '', 'GERENTE', 'ACTIVO'),
('Cocinero', 'cocinero@test.com', '$2a$10$Dow1QyGJ0v7FpC18JNpDne6N9KuX3sX5Yucs5cjox96D65gis6pZe', '', 'COCINERO', 'ACTIVO'),
('Camarero', 'camarero@test.com', '$2a$10$Dow1QyGJ0v7FpC18JNpDne6N9KuX3sX5Yucs5cjox96D65gis6pZe', '', 'CAMARERO', 'ACTIVO');

-- ============================================
-- DATOS DE PLATOS
-- ============================================

INSERT INTO plato (nombre, descripcion, precio, imagen, tipo, disponible)
VALUES
('Pizza Margarita', 'Pizza clásica con tomate y queso', 8.50, 'pizza.jpg', 'PRIMERO', true),
('Hamburguesa', 'Hamburguesa con patatas', 9.90, 'hamburguesa.jpg', 'SEGUNDO', true),
('Ensalada César', 'Ensalada fresca con pollo', 6.50, 'ensalada.jpg', 'PRIMERO', true),
('Tarta de queso', 'Postre casero', 4.50, 'tarta.jpg', 'POSTRE', true),
('Coca-Cola', 'Refresco', 2.50, 'cocacola.jpg', 'BEBIDA', true);

-- ============================================
-- DATOS DE SERVICIO + PEDIDOS (PRUEBA)
-- ============================================

-- Crear servicio abierto
INSERT INTO servicio (estado, mesa) VALUES ('Abierto', 1);

-- Crear pedidos asociados al servicio 1
INSERT INTO pedido (mesa, estado, plato_id, servicio_id, fecha_hora)
VALUES
(1, 'Pendiente', 1, 1, NOW()),
(1, 'Pendiente', 2, 1, NOW());

-- ============================================
-- NOTAS
-- ============================================

-- LOGIN:
-- gerente@test.com / 1234
-- cocinero@test.com / 1234
-- camarero@test.com / 1234

-- IMPORTANTE:
-- - ENUMS deben coincidir EXACTAMENTE con Java
-- - Imágenes en /uploads del backend