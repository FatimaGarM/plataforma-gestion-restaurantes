-- ============================================
-- BASE DE DATOS - RESTAURANTE QR (OK DEFINITIVO)
-- ============================================

DROP DATABASE IF EXISTS restaurante_qr;
CREATE DATABASE restaurante_qr;
USE restaurante_qr;

-- ============================================
-- TABLA EMPLEADO
-- ============================================

CREATE TABLE empleado (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    contraseña VARCHAR(255),
    imagen VARCHAR(255),
    tipo_empleado VARCHAR(50), -- GERENTE, COCINERO, CAMARERO
    estado VARCHAR(50)         -- ACTIVO
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
    tipo VARCHAR(50),     -- PRIMERO, SEGUNDO, POSTRE, BEBIDA
    disponible BOOLEAN
);

-- ============================================
-- TABLA SERVICIO
-- ============================================

CREATE TABLE servicio (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    estado TINYINT,   -- 1 = ABIERTO, 0 = CERRADO
    mesa INT
);

-- ============================================
-- TABLA PEDIDO (CLAVE AQUÍ 👇)
-- ============================================

CREATE TABLE pedido (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    mesa INT,
    estado VARCHAR(50), -- 👈 DEBE COINCIDIR EXACTAMENTE CON ENUM JAVA
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
-- EMPLEADOS
-- ============================================

INSERT INTO empleado (nombre, email, contraseña, imagen, tipo_empleado, estado)
VALUES
('Gerente', 'gerente@test.com', '$2a$10$Dow1QyGJ0v7FpC18JNpDne6N9KuX3sX5Yucs5cjox96D65gis6pZe', '', 'GERENTE', 'ACTIVO'),
('Cocinero', 'cocinero@test.com', '$2a$10$Dow1QyGJ0v7FpC18JNpDne6N9KuX3sX5Yucs5cjox96D65gis6pZe', '', 'COCINERO', 'ACTIVO'),
('Camarero', 'camarero@test.com', '$2a$10$Dow1QyGJ0v7FpC18JNpDne6N9KuX3sX5Yucs5cjox96D65gis6pZe', '', 'CAMARERO', 'ACTIVO');

-- ============================================
-- PLATOS
-- ============================================

INSERT INTO plato (nombre, descripcion, precio, imagen, tipo, disponible)
VALUES
('Pizza Margarita', 'Pizza clásica con tomate y queso', 8.50, 'pizza.jpg', 'PRIMERO', true),
('Hamburguesa', 'Hamburguesa con patatas', 9.90, 'hamburguesa.jpg', 'SEGUNDO', true),
('Ensalada César', 'Ensalada fresca con pollo', 6.50, 'ensalada.jpg', 'PRIMERO', true),
('Tarta de queso', 'Postre casero', 4.50, 'tarta.jpg', 'POSTRE', true),
('Coca-Cola', 'Refresco', 2.50, 'cocacola.jpg', 'BEBIDA', true);

-- ============================================
-- SERVICIO
-- ============================================

INSERT INTO servicio (estado, mesa) VALUES (1, 1);

-- ============================================
-- PEDIDOS (⚠️ AQUÍ ESTÁ LA CLAVE)
-- ============================================

INSERT INTO pedido (mesa, estado, plato_id, servicio_id)
VALUES
(1, 'Pendiente', 1, 1),
(1, 'Pendiente', 2, 1);

-- ============================================
-- LOGIN
-- ============================================

-- contraseña: 1234
-- gerente@test.com
-- cocinero@test.com
-- camarero@test.com