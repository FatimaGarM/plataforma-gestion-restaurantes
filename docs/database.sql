-- ============================================
-- BASE DE DATOS - GESTIÓN RESTAURANTE QR
-- ============================================

CREATE DATABASE IF NOT EXISTS restaurante_qr;
USE restaurante_qr;

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
-- DATOS DE EMPLEADOS (LOGIN REAL)
-- contraseña = 1234 (encriptada con BCrypt)
-- ============================================

INSERT INTO empleado (nombre, email, contraseña, imagen, tipo_empleado, estado)
VALUES
('Gerente', 'gerente@test.com', '$2a$10$Dow1QyGJ0v7FpC18JNpDne6N9KuX3sX5Yucs5cjox96D65gis6pZe', '', 'Gerente', 'Activo'),
('Cocinero', 'cocinero@test.com', '$2a$10$Dow1QyGJ0v7FpC18JNpDne6N9KuX3sX5Yucs5cjox96D65gis6pZe', '', 'Cocinero', 'Activo'),
('Camarero', 'camarero@test.com', '$2a$10$Dow1QyGJ0v7FpC18JNpDne6N9KuX3sX5Yucs5cjox96D65gis6pZe', '', 'Camarero', 'Activo');

-- ============================================
-- DATOS DE PLATOS
-- ============================================

INSERT INTO plato (nombre, descripcion, precio, imagen, tipo, disponible)
VALUES
('Pizza Margarita', 'Pizza clásica con tomate y queso', 8.50, 'pizza.jpg', 'Primero', true),
('Hamburguesa', 'Hamburguesa con patatas', 9.90, 'hamburguesa.jpg', 'Segundo', true),
('Ensalada César', 'Ensalada fresca con pollo', 6.50, 'ensalada.jpg', 'Primero', true),
('Tarta de queso', 'Postre casero', 4.50, 'tarta.jpg', 'Postre', true),
('Coca-Cola', 'Refresco', 2.50, 'cocacola.jpg', 'Bebida', true);

-- ============================================
-- NOTAS
-- ============================================

-- Usuarios de prueba:
-- gerente@test.com / 1234
-- cocinero@test.com / 1234
-- camarero@test.com / 1234

-- Las imágenes deben estar en /uploads del backend