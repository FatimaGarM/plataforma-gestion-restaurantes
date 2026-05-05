-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 03-05-2026 a las 19:26:47
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `restaurante_qr`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `carta`
--

CREATE TABLE `carta` (
  `id` bigint(20) NOT NULL,
  `nombre` varchar(255) DEFAULT NULL,
  `imagen_banner` varchar(255) DEFAULT NULL,
  `activa` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `carta`
--

INSERT INTO `carta` (`id`, `nombre`, `imagen_banner`, `activa`) VALUES
(1, 'Carta Bar La Alameda', '1776960209185_¿Dónde cenar un domingo o un lunes en Sevilla_.png', 1),
(2, 'Prueba', NULL, 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cobro_persona`
--

CREATE TABLE `cobro_persona` (
  `id` bigint(20) NOT NULL,
  `cobrado` bit(1) NOT NULL,
  `fecha_cobro` datetime(6) DEFAULT NULL,
  `importe` double DEFAULT NULL,
  `persona` int(11) DEFAULT NULL,
  `servicio_id` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `cobro_persona`
--

INSERT INTO `cobro_persona` (`id`, `cobrado`, `fecha_cobro`, `importe`, `persona`, `servicio_id`) VALUES
(39, b'1', '2026-05-03 12:24:06.000000', 20.7, 1, 43),
(40, b'1', '2026-05-03 12:24:16.000000', 7.2, 2, 43),
(41, b'1', '2026-05-03 12:24:18.000000', 15.6, 3, 43),
(42, b'1', '2026-05-03 12:30:50.000000', 36, 1, 44),
(43, b'1', '2026-05-03 12:31:24.000000', 38.8, 2, 44),
(44, b'1', '2026-05-03 12:31:46.000000', 15.6, 3, 44),
(45, b'1', '2026-05-03 12:31:50.000000', 15.6, 4, 44),
(46, b'1', '2026-05-03 12:39:53.000000', 13, 1, 46),
(47, b'1', '2026-05-03 12:40:10.000000', 13, 1, 47),
(48, b'1', '2026-05-03 18:27:34.000000', 11.6, 1, 48),
(49, b'1', '2026-05-03 18:27:35.000000', 13, 2, 48),
(50, b'1', '2026-05-03 18:29:28.000000', 13, 1, 49),
(51, b'1', '2026-05-03 18:29:30.000000', 15.6, 2, 49),
(52, b'1', '2026-05-03 19:13:42.000000', 7.3, 1, 50),
(53, b'1', '2026-05-03 19:13:42.000000', 5.8, 2, 50);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `comensal`
--

CREATE TABLE `comensal` (
  `id` bigint(20) NOT NULL,
  `nombre` varchar(255) DEFAULT NULL,
  `numero` int(11) DEFAULT NULL,
  `sesion_mesa_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `comensal`
--

INSERT INTO `comensal` (`id`, `nombre`, `numero`, `sesion_mesa_id`) VALUES
(8, NULL, 1, 121),
(9, NULL, 2, 121),
(10, NULL, 3, 121),
(11, NULL, 1, 122),
(12, NULL, 2, 122),
(13, NULL, 3, 122),
(14, NULL, 4, 122),
(15, NULL, 1, 123),
(16, NULL, 1, 124),
(17, NULL, 2, 124),
(18, NULL, 1, 127),
(19, NULL, 2, 127),
(20, NULL, 1, 128),
(21, NULL, 2, 128),
(22, NULL, 3, 128),
(23, NULL, 2, 130),
(24, NULL, 1, 130);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `configuracion_restaurante`
--

CREATE TABLE `configuracion_restaurante` (
  `id` bigint(20) NOT NULL,
  `color_primario` varchar(255) DEFAULT NULL,
  `color_secundario` varchar(255) DEFAULT NULL,
  `imagen_fondo` varchar(255) DEFAULT NULL,
  `logo` varchar(255) DEFAULT NULL,
  `nombre_restaurante` varchar(255) DEFAULT NULL,
  `direccion` varchar(255) DEFAULT NULL,
  `email_contacto` varchar(255) DEFAULT NULL,
  `idioma_carta` varchar(255) DEFAULT NULL,
  `telefono` varchar(255) DEFAULT NULL,
  `url_cliente_publica` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `configuracion_restaurante`
--

INSERT INTO `configuracion_restaurante` (`id`, `color_primario`, `color_secundario`, `imagen_fondo`, `logo`, `nombre_restaurante`, `direccion`, `email_contacto`, `idioma_carta`, `telefono`, `url_cliente_publica`) VALUES
(1, '#b45309', '#065f46', '1776960149249_Oasis urbanos secretos_ Guía de las mejores terrazas españolas.png', '1776969974163_descarga (5).png', 'Bar La Alameda ', 'Calle Jazmín 18, Sevilla', 'info@barlaalameda.es', 'es,en', '77 777 777', 'https://cpnltdrs-5173.uks1.devtunnels.ms/');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `empleado`
--

CREATE TABLE `empleado` (
  `id` bigint(20) NOT NULL,
  `nombre` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `contraseña` varchar(255) DEFAULT NULL,
  `imagen` varchar(255) DEFAULT NULL,
  `tipo_empleado` varchar(50) DEFAULT NULL,
  `estado` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `empleado`
--

INSERT INTO `empleado` (`id`, `nombre`, `email`, `contraseña`, `imagen`, `tipo_empleado`, `estado`) VALUES
(1, 'Gerente ', 'gerente@test.es', '$2a$10$E9dK8r3HaEa9X4OtnNL7BOnjIOCkOjfp9BITUcdAM24BaFdudMKv.', '1777037682860_1777015206662_Surveyor free icons designed by Freepik.png', 'GERENTE', 'ACTIVO'),
(2, 'Raúl Fernandez', 'camarero1@test.es', '$2a$10$E9dK8r3HaEa9X4OtnNL7BOnjIOCkOjfp9BITUcdAM24BaFdudMKv.', '1777040931576_camarero.png', 'CAMARERO', 'ACTIVO'),
(3, 'Alba Romero', 'camarero2@test.es', '$2a$10$E9dK8r3HaEa9X4OtnNL7BOnjIOCkOjfp9BITUcdAM24BaFdudMKv.', '1777037658224_1777014790255_Bouquet de Grenelle restaurant--our cute & enthusiastic waitress_.png', 'CAMARERO', 'ACTIVO'),
(4, 'Jose Manuel Vega', 'cocinero1@test.es', '$2a$10$E9dK8r3HaEa9X4OtnNL7BOnjIOCkOjfp9BITUcdAM24BaFdudMKv.', '1777037694790_1777014943596_Cocina creativa en proceso – Marc Hernández Vallés.png', 'COCINERO', 'ACTIVO'),
(5, 'Carmen Ruiz', 'cocinero2@test.es', '$2a$10$E9dK8r3HaEa9X4OtnNL7BOnjIOCkOjfp9BITUcdAM24BaFdudMKv.', '1777037667899_1777014835976_Chef Cocinando.png', 'COCINERO', 'ACTIVO'),
(6, 'Admin Pruebas', 'admin@test.es', '$2a$10$E9dK8r3HaEa9X4OtnNL7BOnjIOCkOjfp9BITUcdAM24BaFdudMKv.', '1777037643892_1777014623140_Operator directional icon.png', 'GERENTE', 'ACTIVO');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `item_seccion`
--

CREATE TABLE `item_seccion` (
  `id` bigint(20) NOT NULL,
  `orden` int(11) DEFAULT NULL,
  `seccion_id` bigint(20) DEFAULT NULL,
  `plato_id` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `item_seccion`
--

INSERT INTO `item_seccion` (`id`, `orden`, `seccion_id`, `plato_id`) VALUES
(1, 1, 1, 1),
(2, 0, 1, 2),
(3, 2, 1, 3),
(4, 3, 1, 4),
(5, 0, 2, 5),
(6, 1, 2, 6),
(7, 2, 2, 7),
(8, 3, 2, 8),
(9, 0, 3, 9),
(10, 1, 3, 10),
(11, 2, 3, 11),
(12, 3, 3, 12),
(13, 0, 4, 13),
(14, 1, 4, 14),
(15, 2, 4, 15),
(16, 3, 4, 16),
(17, 0, 5, 17),
(18, 1, 5, 18),
(19, 0, 6, 19),
(20, 1, 6, 20),
(21, 2, 6, 21),
(22, 0, 7, 22),
(23, 1, 7, 23),
(24, 2, 7, 24);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `llamada_camarero`
--

CREATE TABLE `llamada_camarero` (
  `id` bigint(20) NOT NULL,
  `estado` enum('ATENDIDA','CANCELADA','PENDIENTE') DEFAULT NULL,
  `fecha_atencion` datetime(6) DEFAULT NULL,
  `fecha_creacion` datetime(6) DEFAULT NULL,
  `metodo_pago` varchar(255) DEFAULT NULL,
  `tipo` enum('LLAMAR_CAMARERO','PEDIR_CUENTA') DEFAULT NULL,
  `servicio_id` bigint(20) NOT NULL,
  `sesion_mesa_id` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `menu`
--

CREATE TABLE `menu` (
  `id` bigint(20) NOT NULL,
  `dia` varchar(255) DEFAULT NULL,
  `precio` double NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `menu`
--

INSERT INTO `menu` (`id`, `dia`, `precio`) VALUES
(2, 'Martes', 13),
(3, 'Miercoles', 13.5),
(4, 'Jueves', 12),
(5, 'Viernes', 14),
(6, 'Lunes', 8),
(7, 'Sabado', 12.5),
(9, 'Domingo', 15.6);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `menu_plato`
--

CREATE TABLE `menu_plato` (
  `id` bigint(20) NOT NULL,
  `tipo_plato` varchar(255) DEFAULT NULL,
  `orden` int(11) NOT NULL,
  `menu_id` bigint(20) DEFAULT NULL,
  `plato_id` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `menu_plato`
--

INSERT INTO `menu_plato` (`id`, `tipo_plato`, `orden`, `menu_id`, `plato_id`) VALUES
(67, 'PRIMERO', 1, 6, 2),
(68, 'PRIMERO', 2, 6, 3),
(69, 'PRIMERO', 3, 6, 9),
(70, 'SEGUNDO', 1, 6, 5),
(71, 'SEGUNDO', 2, 6, 6),
(72, 'SEGUNDO', 3, 6, 7),
(73, 'POSTRE', 1, 6, 19),
(74, 'POSTRE', 2, 6, 20),
(75, 'POSTRE', 3, 6, 21),
(76, 'BEBIDA', 1, 6, 22),
(77, 'BEBIDA', 2, 6, 23),
(78, 'BEBIDA', 3, 6, 24),
(79, 'PRIMERO', 1, 2, 2),
(80, 'PRIMERO', 2, 2, 10),
(81, 'PRIMERO', 3, 2, 17),
(82, 'SEGUNDO', 1, 2, 5),
(83, 'SEGUNDO', 2, 2, 8),
(84, 'SEGUNDO', 3, 2, 13),
(85, 'POSTRE', 1, 2, 19),
(86, 'POSTRE', 2, 2, 20),
(87, 'POSTRE', 3, 2, 21),
(88, 'BEBIDA', 1, 2, 22),
(89, 'BEBIDA', 2, 2, 23),
(90, 'BEBIDA', 3, 2, 24),
(91, 'PRIMERO', 1, 3, 3),
(92, 'PRIMERO', 2, 3, 11),
(93, 'PRIMERO', 3, 3, 18),
(94, 'SEGUNDO', 1, 3, 6),
(95, 'SEGUNDO', 2, 3, 7),
(96, 'SEGUNDO', 3, 3, 14),
(97, 'POSTRE', 1, 3, 19),
(98, 'POSTRE', 2, 3, 20),
(99, 'POSTRE', 3, 3, 21),
(100, 'BEBIDA', 1, 3, 22),
(101, 'BEBIDA', 2, 3, 23),
(102, 'BEBIDA', 3, 3, 24),
(103, 'PRIMERO', 1, 4, 2),
(104, 'PRIMERO', 2, 4, 4),
(105, 'PRIMERO', 3, 4, 12),
(106, 'SEGUNDO', 1, 4, 5),
(107, 'SEGUNDO', 2, 4, 7),
(108, 'SEGUNDO', 3, 4, 15),
(109, 'POSTRE', 1, 4, 19),
(110, 'POSTRE', 2, 4, 20),
(111, 'POSTRE', 3, 4, 21),
(112, 'BEBIDA', 1, 4, 22),
(113, 'BEBIDA', 2, 4, 23),
(114, 'BEBIDA', 3, 4, 24),
(115, 'PRIMERO', 1, 5, 9),
(116, 'PRIMERO', 2, 5, 10),
(117, 'PRIMERO', 3, 5, 17),
(118, 'SEGUNDO', 1, 5, 6),
(119, 'SEGUNDO', 2, 5, 8),
(120, 'SEGUNDO', 3, 5, 16),
(121, 'POSTRE', 1, 5, 19),
(122, 'POSTRE', 2, 5, 20),
(123, 'POSTRE', 3, 5, 21),
(124, 'BEBIDA', 1, 5, 22),
(125, 'BEBIDA', 2, 5, 23),
(126, 'BEBIDA', 3, 5, 24),
(127, 'PRIMERO', 1, 7, 2),
(128, 'PRIMERO', 2, 7, 3),
(129, 'PRIMERO', 3, 7, 10),
(130, 'SEGUNDO', 1, 7, 5),
(131, 'SEGUNDO', 2, 7, 6),
(132, 'SEGUNDO', 3, 7, 8),
(133, 'POSTRE', 1, 7, 19),
(134, 'POSTRE', 2, 7, 20),
(135, 'POSTRE', 3, 7, 21),
(136, 'BEBIDA', 1, 7, 22),
(137, 'BEBIDA', 2, 7, 23),
(138, 'BEBIDA', 3, 7, 24),
(139, 'PRIMERO', 0, 9, 2),
(140, 'PRIMERO', 1, 9, 3),
(141, 'SEGUNDO', 0, 9, 8),
(142, 'SEGUNDO', 1, 9, 5),
(143, 'POSTRE', 0, 9, 19),
(144, 'POSTRE', 1, 9, 21),
(145, 'BEBIDA', 0, 9, 23),
(146, 'BEBIDA', 1, 9, 22),
(147, 'BEBIDA', 2, 9, 24);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pedido`
--

CREATE TABLE `pedido` (
  `id` bigint(20) NOT NULL,
  `mesa` int(11) DEFAULT NULL,
  `estado` varchar(50) DEFAULT NULL,
  `fecha_hora` datetime DEFAULT current_timestamp(),
  `plato_id` bigint(20) DEFAULT NULL,
  `servicio_id` bigint(20) DEFAULT NULL,
  `persona` int(11) DEFAULT NULL,
  `es_menu` bit(1) DEFAULT NULL,
  `precio_unitario` double DEFAULT NULL,
  `comensal_id` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `pedido`
--

INSERT INTO `pedido` (`id`, `mesa`, `estado`, `fecha_hora`, `plato_id`, `servicio_id`, `persona`, `es_menu`, `precio_unitario`, `comensal_id`) VALUES
(1, 1, 'Servido', '2026-04-19 13:10:00', 1, 1, NULL, b'0', 0, NULL),
(2, 1, 'Servido', '2026-04-19 13:12:00', 3, 1, NULL, b'0', 0, NULL),
(3, 2, 'Servido', '2026-04-19 13:25:00', 5, 2, NULL, b'0', 0, NULL),
(4, 2, 'Servido', '2026-04-19 13:30:00', 22, 2, NULL, b'0', 0, NULL),
(5, 3, 'Servido', '2026-04-19 14:05:00', 9, 3, NULL, b'0', 0, NULL),
(6, 4, 'Servido', '2026-04-19 14:15:00', 19, 4, NULL, b'0', 0, NULL),
(7, 1, 'Servido', '2026-04-17 12:50:00', 2, 5, NULL, b'0', 0, NULL),
(8, 1, 'Servido', '2026-04-17 13:00:00', 13, 5, NULL, b'0', 0, NULL),
(9, 2, 'Servido', '2026-04-17 13:20:00', 6, 6, NULL, b'0', 0, NULL),
(10, 5, 'Servido', '2026-04-17 13:35:00', 24, 7, NULL, b'0', 0, NULL),
(11, 3, 'Servido', '2026-04-14 13:05:00', 17, 8, NULL, b'0', 0, NULL),
(12, 6, 'Servido', '2026-04-14 13:20:00', 10, 9, NULL, b'0', 0, NULL),
(13, 2, 'Servido', '2026-04-14 14:00:00', 20, 10, NULL, b'0', 0, NULL),
(14, 4, 'Servido', '2026-04-10 21:10:00', 7, 11, NULL, b'0', 0, NULL),
(15, 7, 'Servido', '2026-04-10 21:20:00', 23, 12, NULL, b'0', 0, NULL),
(16, 1, 'Servido', '2026-04-09 13:00:00', 4, 13, NULL, b'0', 0, NULL),
(17, 3, 'Servido', '2026-04-09 13:10:00', 8, 14, NULL, b'0', 0, NULL),
(18, 2, 'Servido', '2026-03-29 13:10:00', 1, 15, NULL, b'0', 0, NULL),
(19, 2, 'Servido', '2026-03-29 13:15:00', 11, 15, NULL, b'0', 0, NULL),
(20, 5, 'Servido', '2026-03-29 13:45:00', 19, 16, NULL, b'0', 0, NULL),
(21, 1, 'Servido', '2026-03-24 12:40:00', 3, 1, NULL, b'0', 0, NULL),
(22, 1, 'Servido', '2026-03-24 12:45:00', 22, 1, NULL, b'0', 0, NULL),
(23, 3, 'Servido', '2026-03-24 13:05:00', 12, 2, NULL, b'0', 0, NULL),
(24, 3, 'Servido', '2026-03-24 13:10:00', 21, 2, NULL, b'0', 0, NULL),
(25, 4, 'Servido', '2026-03-18 14:00:00', 6, 3, NULL, b'0', 0, NULL),
(26, 4, 'Servido', '2026-03-18 14:10:00', 23, 3, NULL, b'0', 0, NULL),
(27, 6, 'Servido', '2026-03-18 21:00:00', 14, 4, NULL, b'0', 0, NULL),
(28, 1, 'Servido', '2026-02-26 13:00:00', 5, 5, NULL, b'0', 0, NULL),
(29, 1, 'Servido', '2026-02-26 13:15:00', 24, 5, NULL, b'0', 0, NULL),
(30, 2, 'Servido', '2026-02-26 13:30:00', 9, 6, NULL, b'0', 0, NULL),
(31, 3, 'Servido', '2026-02-21 14:05:00', 17, 7, NULL, b'0', 0, NULL),
(32, 3, 'Servido', '2026-02-21 14:10:00', 10, 7, NULL, b'0', 0, NULL),
(33, 5, 'Servido', '2026-02-21 21:30:00', 20, 8, NULL, b'0', 0, NULL),
(34, 2, 'Servido', '2026-02-18 13:05:00', 2, 9, NULL, b'0', 0, NULL),
(35, 2, 'Servido', '2026-02-18 13:15:00', 13, 9, NULL, b'0', 0, NULL),
(36, 4, 'Servido', '2026-02-18 13:30:00', 7, 10, NULL, b'0', 0, NULL),
(37, 4, 'Servido', '2026-02-18 13:35:00', 22, 10, NULL, b'0', 0, NULL),
(38, 7, 'Servido', '2026-02-12 20:50:00', 11, 11, NULL, b'0', 0, NULL),
(39, 7, 'Servido', '2026-02-12 21:00:00', 23, 11, NULL, b'0', 0, NULL),
(40, 6, 'Servido', '2026-02-08 13:25:00', 18, 12, NULL, b'0', 0, NULL),
(41, 1, 'Servido', '2026-04-20 18:11:02', 1, 17, NULL, b'0', 0, NULL),
(42, 1, 'Servido', '2026-04-20 18:11:02', 1, 17, NULL, b'0', 0, NULL),
(43, 1, 'Servido', '2026-04-20 18:11:02', 2, 17, NULL, b'0', 0, NULL),
(44, 1, 'Servido', '2026-04-20 18:11:02', 3, 17, NULL, b'0', 0, NULL),
(45, 1, 'Servido', '2026-04-20 18:11:02', 4, 17, NULL, b'0', 0, NULL),
(46, 1, 'Servido', '2026-04-20 18:11:02', 6, 17, NULL, b'0', 0, NULL),
(47, 1, 'Servido', '2026-04-20 18:11:02', 20, 17, NULL, b'0', 0, NULL),
(48, 1, 'Servido', '2026-04-20 19:09:45', 1, 18, NULL, b'0', 0, NULL),
(49, 1, 'Servido', '2026-04-20 19:09:45', 1, 18, NULL, b'0', 0, NULL),
(50, 1, 'EnProceso', '2026-04-20 19:09:45', 2, 18, NULL, b'0', 0, NULL),
(51, 1, 'EnProceso', '2026-04-20 19:09:45', 2, 18, NULL, b'0', 0, NULL),
(61, 1, 'Servido', '2026-04-21 23:47:55', 1, 21, 1, b'0', 0, NULL),
(62, 1, 'Servido', '2026-04-21 23:49:22', 1, 21, 1, b'0', 0, NULL),
(152, 2, 'Servido', '2026-05-03 12:10:27', 2, 43, 1, b'0', 5.8, 8),
(153, 2, 'Servido', '2026-05-03 12:10:27', 3, 43, 2, b'0', 7.2, 9),
(154, 2, 'Servido', '2026-05-03 12:10:27', 5, 43, 1, b'0', 14.9, 8),
(155, 2, 'Servido', '2026-05-03 12:22:16', 2, 43, 3, b'1', 3.9, 10),
(156, 2, 'Servido', '2026-05-03 12:22:16', 8, 43, 3, b'1', 3.9, 10),
(157, 2, 'Servido', '2026-05-03 12:22:16', 19, 43, 3, b'1', 3.9, 10),
(158, 2, 'Servido', '2026-05-03 12:22:16', 23, 43, 3, b'1', 3.9, 10),
(159, 2, 'Servido', '2026-05-03 12:25:44', 2, 44, 1, b'0', 5.8, 11),
(160, 2, 'Servido', '2026-05-03 12:25:44', 3, 44, 1, b'0', 7.2, 11),
(161, 2, 'Servido', '2026-05-03 12:25:44', 4, 44, 1, b'0', 9.5, 11),
(162, 2, 'Servido', '2026-05-03 12:25:44', 6, 44, 1, b'0', 13.5, 11),
(163, 2, 'Servido', '2026-05-03 12:26:37', 2, 44, 2, b'0', 5.8, 12),
(164, 2, 'Servido', '2026-05-03 12:26:37', 3, 44, 2, b'0', 7.2, 12),
(165, 2, 'Servido', '2026-05-03 12:26:37', 4, 44, 2, b'0', 9.5, 12),
(166, 2, 'Servido', '2026-05-03 12:26:37', 4, 44, 2, b'0', 9.5, 12),
(167, 2, 'Servido', '2026-05-03 12:26:37', 16, 44, 2, b'0', 6.8, 12),
(168, 2, 'Servido', '2026-05-03 12:27:43', 2, 44, 3, b'1', 3.9, 13),
(169, 2, 'Servido', '2026-05-03 12:27:43', 19, 44, 3, b'1', 3.9, 13),
(170, 2, 'Servido', '2026-05-03 12:27:43', 5, 44, 3, b'1', 3.9, 13),
(171, 2, 'Servido', '2026-05-03 12:27:43', 22, 44, 3, b'1', 3.9, 13),
(172, 2, 'Servido', '2026-05-03 12:28:47', 2, 44, 4, b'1', 3.9, 14),
(173, 2, 'Servido', '2026-05-03 12:28:47', 8, 44, 4, b'1', 3.9, 14),
(174, 2, 'Servido', '2026-05-03 12:28:47', 21, 44, 4, b'1', 3.9, 14),
(175, 2, 'Servido', '2026-05-03 12:28:47', 22, 44, 4, b'1', 3.9, 14),
(176, 2, 'Pendiente', '2026-05-03 12:35:30', 2, 45, 2, b'0', 5.8, 12),
(177, 2, 'Pendiente', '2026-05-03 12:35:31', 3, 45, 2, b'0', 7.2, 12),
(178, 6, 'Pendiente', '2026-05-03 12:38:59', 2, 46, 1, b'0', 5.8, 15),
(179, 6, 'Pendiente', '2026-05-03 12:38:59', 3, 46, 1, b'0', 7.2, 15),
(180, 5, 'Pendiente', '2026-05-03 12:39:46', 2, 47, 1, b'0', 5.8, 16),
(181, 5, 'Pendiente', '2026-05-03 12:39:46', 3, 47, 1, b'0', 7.2, 16),
(182, 5, 'Pendiente', '2026-05-03 13:34:20', 2, 47, 2, b'0', 5.8, 17),
(183, 5, 'Pendiente', '2026-05-03 13:34:21', 3, 47, 2, b'0', 7.2, 17),
(184, 5, 'Servido', '2026-05-03 18:26:53', 2, 48, 1, b'0', 5.8, 18),
(185, 5, 'Servido', '2026-05-03 18:26:53', 2, 48, 1, b'0', 5.8, 18),
(186, 5, 'Servido', '2026-05-03 18:27:27', 2, 48, 2, b'0', 5.8, 19),
(187, 5, 'Servido', '2026-05-03 18:27:27', 3, 48, 2, b'0', 7.2, 19),
(188, 2, 'Servido', '2026-05-03 18:28:13', 2, 49, 1, b'0', 5.8, 20),
(189, 2, 'Servido', '2026-05-03 18:28:13', 3, 49, 1, b'0', 7.2, 20),
(190, 2, 'Servido', '2026-05-03 18:29:10', 2, 49, 2, b'1', 3.9, 21),
(191, 2, 'Servido', '2026-05-03 18:29:10', 8, 49, 2, b'1', 3.9, 21),
(192, 2, 'Servido', '2026-05-03 18:29:10', 23, 49, 2, b'1', 3.9, 21),
(193, 2, 'Servido', '2026-05-03 18:29:10', 19, 49, 2, b'1', 3.9, 21),
(194, 2, 'Servido', '2026-05-03 18:31:54', 2, 49, 3, b'0', 5.8, 22),
(195, 2, 'Servido', '2026-05-03 18:31:54', 5, 49, 3, b'0', 14.9, 22),
(196, 2, 'Servido', '2026-05-03 18:31:54', 9, 49, 3, b'0', 10.9, 22),
(197, 2, 'Servido', '2026-05-03 18:31:54', 13, 49, 3, b'0', 7, 22),
(198, 2, 'Servido', '2026-05-03 18:31:54', 17, 49, 3, b'0', 14.5, 22),
(199, 2, 'Servido', '2026-05-03 19:12:48', 2, 50, 2, b'0', 5.8, 23),
(200, 2, 'Servido', '2026-05-03 19:12:48', 1, 50, 1, b'0', 5.5, 24),
(201, 2, 'Servido', '2026-05-03 19:12:48', 24, 50, 1, b'0', 1.8, 24);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `plato`
--

CREATE TABLE `plato` (
  `id` bigint(20) NOT NULL,
  `nombre` varchar(255) DEFAULT NULL,
  `nombre_en` varchar(255) DEFAULT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  `descripcion_en` varchar(255) DEFAULT NULL,
  `precio` double DEFAULT NULL,
  `imagen` varchar(255) DEFAULT NULL,
  `tipo` varchar(50) DEFAULT NULL,
  `disponible` tinyint(1) DEFAULT NULL,
  `es_novedad` tinyint(1) DEFAULT 0,
  `fecha_creacion` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `plato`
--

INSERT INTO `plato` (`id`, `nombre`, `nombre_en`, `descripcion`, `descripcion_en`, `precio`, `imagen`, `tipo`, `disponible`, `es_novedad`, `fecha_creacion`) VALUES
(1, 'Ensaladilla rusa', 'Russian salad', 'Patata, atun, huevo y mahonesa casera', 'Potato, tuna, egg and homemade mayo', 5.5, '1776960428382_7 tips para preparar la ensalada rusa perfecta y deliciosa.png', 'PRIMERO', 1, 0, '2026-03-01'),
(2, 'Salmorejo cordobes', 'Cordoban salmorejo', 'Crema fria de tomate con jamon y huevo', 'Cold tomato cream with ham and egg', 5.8, '1776960466531_🍅🥖 Salmorejo Cordobés_ Cremoso y Refrescante 🇪🇸.png', 'PRIMERO', 1, 0, '2026-03-01'),
(3, 'Croquetas de jamon', 'Iberian ham croquettes', 'Croquetas caseras crujientes', 'Homemade crispy croquettes', 7.2, '1776960503574_Croquetas de Jamón CRUJIENTES que te sorprenderán hoy_ - recetasdeluisa.png', 'PRIMERO', 1, 1, '2026-03-05'),
(4, 'Flamenquin', 'Flamenquin', 'Lomo enrollado con jamon serrano', 'Pork loin roll with serrano ham', 9.5, '1776960544623_Cómo se hacen los flamenquines cordobeses.png', 'PRIMERO', 1, 0, '2026-03-06'),
(5, 'Secreto iberico', 'Iberian pork secreto', 'A la plancha con patatas fritas', 'Grilled with fries', 14.9, '1776960659630_Lola And Miguel - Canada\'s Online Spanish Food Store.png', 'SEGUNDO', 1, 1, '2026-03-08'),
(6, 'Solomillo al whisky', 'Pork tenderloin in whisky sauce', 'Receta tradicional sevillana', 'Traditional Seville style recipe', 13.5, '1776960776156_Cocina con Amor.png', 'SEGUNDO', 1, 0, '2026-03-08'),
(7, 'Carrillada al vino tinto', 'Pork cheeks in red wine', 'Coccion lenta con salsa de vino', 'Slow cooked with red wine sauce', 15, '1776960893644_🍷 Carrilleras de Cerdo al Vino Tinto 🍷🥩 ¡Deliciosas y Tiernas!.png', 'SEGUNDO', 1, 0, '2026-03-08'),
(8, 'Presa iberica', 'Iberian presa', 'Carne jugosa a la brasa', 'Juicy grilled cut', 16, '1776961048301_PROD_00215.png', 'SEGUNDO', 1, 0, '2026-03-09'),
(9, 'Chocos fritos', 'Fried cuttlefish', 'Racion de chocos al estilo de Huelva', 'Huelva style fried cuttlefish', 10.9, '1776961104867_Choco frito.png', 'PRIMERO', 1, 0, '2026-03-10'),
(10, 'Boquerones fritos', 'Fried anchovies', 'Boqueron fresco en fritura andaluza', 'Fresh anchovies, Andalusian fried style', 9.8, '1776961171033_Spaanse Gebakken Ansjovis - Boquerones Fritos - Discover Spain Today.png', 'PRIMERO', 1, 0, '2026-03-10'),
(11, 'Bacalao confitado', 'Confit cod', 'Con pimientos asados', 'With roasted peppers', 14, '1776961210490_Bacalao confitado con salmorejo de mejillones.png', 'PRIMERO', 1, 0, '2026-03-11'),
(12, 'Atun encebollado', 'Tuna with onion sauce', 'Atun guisado con cebolla', 'Stewed tuna with onion', 13.8, '1776961272082_Atún encebollado con pimienta.png', 'PRIMERO', 1, 1, '2026-03-11'),
(13, 'Serranito', 'Serranito sandwich', 'Lomo, jamon serrano y pimiento verde', 'Pork loin, serrano ham and green pepper', 7, '1776961312452_SUPER-SERRANITO.png', 'SEGUNDO', 1, 0, '2026-03-12'),
(14, 'Bocadillo de calamares', 'Calamari sandwich', 'Calamares fritos con alioli', 'Fried calamari with aioli', 7.5, '1776961341971_Bocadillo de Calamares_ Sabor de Madrid en un bocado 🇪🇸.png', 'SEGUNDO', 1, 0, '2026-03-12'),
(15, 'Montadito de pringa', 'Pringa mini sandwich', 'Carne melosa del puchero andaluz', 'Shredded stew meat in bread', 4.8, '1776961438077_Montadito de PRINGÁ (receta clásica del tapeo sevillano) - PequeRecetas.png', 'SEGUNDO', 1, 0, '2026-03-12'),
(16, 'Bocadillo de lomo', 'Pork loin sandwich', 'Lomo plancha con tomate', 'Grilled pork loin with tomato', 6.8, '1776961538600_f0ec338494c546d39ef455ffdba879db.png', 'SEGUNDO', 1, 0, '2026-03-12'),
(17, 'Paella mixta de la casa', 'House mixed paella', 'Especialidad para compartir', 'House specialty to share', 14.5, '1776961581916_Paella mixta con marisco.png', 'PRIMERO', 1, 1, '2026-03-14'),
(18, 'Arroz meloso de marisco', 'Creamy seafood rice', 'Arroz caldoso con marisco fresco', 'Creamy rice with fresh seafood', 15.2, '1776961636606_arroz-meloso-marisco-1-scaled.png', 'PRIMERO', 1, 0, '2026-03-14'),
(19, 'Tarta de queso al horno', 'Baked cheesecake', 'Con mermelada de frutos rojos', 'With berry jam', 5.2, '1776961672583_Tarta de queso de la viña tradicional (sin gluten y mezcla de quesos).png', 'POSTRE', 1, 0, '2026-03-15'),
(20, 'Tocino de cielo', 'Spanish egg yolk custard', 'Dulce tradicional andaluz', 'Traditional Andalusian dessert', 4.8, '1776961767261_crème caramel.png', 'POSTRE', 1, 0, '2026-03-15'),
(21, 'Flan casero', 'Homemade flan', 'Con nata montada', 'With whipped cream', 4.5, '1776961828358_Flan de Maicena y Leche.png', 'POSTRE', 1, 0, '2026-03-15'),
(22, 'Cerveza de barril', 'Draft beer', 'Cana fria', 'Cold draft beer', 2.2, '1776961887212_Drink.png', 'BEBIDA', 1, 0, '2026-03-16'),
(23, 'Tinto de verano', 'Summer red wine', 'Con limon', 'With lemon soda', 3, '1776961926505_Tinto de Verano_ Una bebida refrescante y fácil de preparar.png', 'BEBIDA', 1, 0, '2026-03-16'),
(24, 'Agua mineral', 'Mineral water', 'Botella de agua 50cl', '50cl bottled water', 1.8, '1776961959350_Papel del agua en la pérdida de peso (1).png', 'BEBIDA', 1, 0, '2026-03-16');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `producto`
--

CREATE TABLE `producto` (
  `id` bigint(20) NOT NULL,
  `nombre` varchar(255) DEFAULT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  `precio` double NOT NULL,
  `stock` int(11) NOT NULL,
  `proveedor_id` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `producto`
--

INSERT INTO `producto` (`id`, `nombre`, `descripcion`, `precio`, `stock`, `proveedor_id`) VALUES
(1, 'Jamón ibérico de bellota', 'Pieza entera curada 24 meses', 45, 5, 1),
(2, 'Lomo ibérico', 'Pieza de lomo ibérico al vacío 500g', 18.5, 20, 1),
(3, 'Secreto ibérico', 'Bandeja 1kg refrigerada', 12.8, 12, 1),
(4, 'Bacalao salado', 'Lomo de bacalao en salazón 1kg', 22, 8, 2),
(5, 'Chocos frescos', 'Choco de Huelva fresco 1kg', 9.5, 10, 2),
(6, 'Gambas blancas', 'Gamba blanca fresca 500g', 35, 6, 2),
(7, 'Cerveza Cruzcampo barril 50L', 'Barril 50 litros presurizado', 85, 4, 3),
(8, 'Vino tinto Ribera barrica', 'Botella 75cl crianza', 8.5, 24, 3),
(9, 'Agua mineral 24 unidades', 'Pack 24 botellas 50cl', 4.8, 30, 3),
(10, 'Patatas', 'Saco 25kg', 1.2, 50, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `proveedor`
--

CREATE TABLE `proveedor` (
  `id` bigint(20) NOT NULL,
  `nombre` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `telefono` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `proveedor`
--

INSERT INTO `proveedor` (`id`, `nombre`, `email`, `telefono`) VALUES
(1, 'Ibéricos del Sur', 'pedidos@ibericossur.es', '954 112 233'),
(2, 'Mariscos y Pescados Huelva', 'info@mariscoushuelva.es', '959 445 667'),
(3, 'Bebidas La Giralda', 'ventas@bebidasgiralda.es', '955 778 990');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `seccion_carta`
--

CREATE TABLE `seccion_carta` (
  `id` bigint(20) NOT NULL,
  `nombre` varchar(255) DEFAULT NULL,
  `nombre_en` varchar(255) DEFAULT NULL,
  `orden` int(11) DEFAULT NULL,
  `carta_id` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `seccion_carta`
--

INSERT INTO `seccion_carta` (`id`, `nombre`, `nombre_en`, `orden`, `carta_id`) VALUES
(1, 'Entrantes', 'Starters', 0, 1),
(2, 'Carnes', 'Meats', 1, 1),
(3, 'Pescados', 'Fish', 2, 1),
(4, 'Bocadillos', 'Sandwiches', 3, 1),
(5, 'Especialidad de la casa', 'House specialty', 4, 1),
(6, 'Postres', 'Desserts', 5, 1),
(7, 'Bebidas', 'Drinks', 6, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `servicio`
--

CREATE TABLE `servicio` (
  `id` bigint(20) NOT NULL,
  `estado` tinyint(4) DEFAULT NULL,
  `mesa` int(11) DEFAULT NULL,
  `estado_cobro` enum('COBRADO_PARCIAL','COBRADO_TOTAL','COBRANDO','PENDIENTE_COBRO','SIN_SOLICITUD') DEFAULT NULL,
  `fecha_solicitud_cobro` datetime(6) DEFAULT NULL,
  `metodo_pago_solicitado` enum('BIZUM','METALICO','TARJETA') DEFAULT NULL,
  `ultima_actividad` datetime(6) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `servicio`
--

INSERT INTO `servicio` (`id`, `estado`, `mesa`, `estado_cobro`, `fecha_solicitud_cobro`, `metodo_pago_solicitado`, `ultima_actividad`) VALUES
(1, 1, 1, NULL, NULL, NULL, NULL),
(2, 1, 2, NULL, NULL, NULL, NULL),
(3, 1, 3, NULL, NULL, NULL, NULL),
(4, 1, 4, NULL, NULL, NULL, NULL),
(5, 1, 1, NULL, NULL, NULL, NULL),
(6, 1, 2, NULL, NULL, NULL, NULL),
(7, 1, 5, NULL, NULL, NULL, NULL),
(8, 1, 3, NULL, NULL, NULL, NULL),
(9, 1, 6, NULL, NULL, NULL, NULL),
(10, 1, 2, NULL, NULL, NULL, NULL),
(11, 1, 4, NULL, NULL, NULL, NULL),
(12, 1, 7, NULL, NULL, NULL, NULL),
(13, 1, 1, NULL, NULL, NULL, NULL),
(14, 1, 3, NULL, NULL, NULL, NULL),
(15, 1, 2, NULL, NULL, NULL, NULL),
(16, 1, 5, NULL, NULL, NULL, NULL),
(17, 1, 1, NULL, NULL, NULL, NULL),
(18, 1, 1, NULL, NULL, NULL, NULL),
(19, 1, 1, NULL, NULL, NULL, NULL),
(20, 1, 1, NULL, NULL, NULL, NULL),
(21, 1, 1, NULL, NULL, NULL, NULL),
(24, 1, 1, 'SIN_SOLICITUD', NULL, NULL, NULL),
(25, 1, 1, 'SIN_SOLICITUD', NULL, NULL, NULL),
(43, 1, 2, 'COBRADO_TOTAL', '2026-05-03 12:23:58.000000', 'TARJETA', '2026-05-03 12:24:18.000000'),
(44, 1, 2, 'COBRADO_TOTAL', '2026-05-03 12:30:05.000000', 'METALICO', '2026-05-03 12:32:35.000000'),
(45, 1, 2, 'SIN_SOLICITUD', NULL, NULL, '2026-05-03 12:35:34.000000'),
(46, 1, 6, 'COBRADO_TOTAL', '2026-05-03 12:39:05.000000', 'TARJETA', '2026-05-03 12:39:53.000000'),
(47, 1, 5, 'COBRADO_TOTAL', '2026-05-03 12:40:05.000000', 'TARJETA', '2026-05-03 13:34:21.000000'),
(48, 1, 5, 'COBRADO_TOTAL', '2026-05-03 18:27:31.000000', 'TARJETA', '2026-05-03 19:07:19.000000'),
(49, 1, 2, 'COBRADO_TOTAL', '2026-05-03 18:29:23.000000', 'TARJETA', '2026-05-03 19:07:32.000000'),
(50, 1, 2, 'COBRADO_TOTAL', '2026-05-03 19:13:30.000000', 'TARJETA', '2026-05-03 19:13:42.000000');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sesion_mesa`
--

CREATE TABLE `sesion_mesa` (
  `id` bigint(20) NOT NULL,
  `activa` bit(1) NOT NULL,
  `creado_en` datetime(6) DEFAULT NULL,
  `mesa` int(11) NOT NULL,
  `token` varchar(255) NOT NULL,
  `codigo_acceso` varchar(16) NOT NULL,
  `contador_personas` int(11) NOT NULL,
  `modo` varchar(255) NOT NULL,
  `ultima_actividad` datetime(6) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `sesion_mesa`
--

INSERT INTO `sesion_mesa` (`id`, `activa`, `creado_en`, `mesa`, `token`, `codigo_acceso`, `contador_personas`, `modo`, `ultima_actividad`) VALUES
(106, b'0', '2026-05-03 11:10:15.000000', 2, '46a55fba-9665-44fa-9ab9-b7683d139e92', 'EGH2H5GF', 1, 'PENDIENTE', '2026-05-03 11:10:15.000000'),
(107, b'0', '2026-05-03 11:10:45.000000', 1, 'a7d280bb-ee6b-4505-8ad8-210bfe6f5af4', 'MESK3UUS', 1, 'PENDIENTE', '2026-05-03 11:10:53.000000'),
(108, b'0', '2026-05-03 11:11:39.000000', 2, 'd3345b74-5855-432c-b4c1-db9dbb100ff0', 'GL4LHA78', 1, 'PENDIENTE', '2026-05-03 11:11:39.000000'),
(109, b'0', '2026-05-03 11:16:25.000000', 2, 'e493ce20-d808-4e07-be2a-57c9b1be7fd7', 'ZQ72VFLG', 1, 'PENDIENTE', '2026-05-03 11:16:26.000000'),
(110, b'0', '2026-05-03 11:20:52.000000', 10, '718c5087-d7ca-4d16-bc69-3748ff8c3a09', 'N7VFCWYJ', 1, 'PENDIENTE', '2026-05-03 11:20:53.000000'),
(111, b'0', '2026-05-03 11:22:14.000000', 2, '9cdd7f20-47c4-4c4d-9593-b2c9c0709932', 'MKAC2839', 1, 'PENDIENTE', '2026-05-03 11:22:38.000000'),
(112, b'0', '2026-05-03 11:22:47.000000', 3, 'a9087235-c8e0-4d7d-aafb-3b843bb59e12', '2KK98VBL', 1, 'PENDIENTE', '2026-05-03 11:22:48.000000'),
(113, b'0', '2026-05-03 11:33:30.000000', 3, 'e1a72f24-c6f2-4dbc-9d3d-054aa083e08a', 'XBRX43XB', 1, 'PENDIENTE', '2026-05-03 11:33:30.000000'),
(114, b'0', '2026-05-03 11:33:59.000000', 5, '47f7c106-5fb9-4106-9764-f2603f7da91b', 'LMDYP3V8', 1, 'PENDIENTE', '2026-05-03 11:34:00.000000'),
(115, b'0', '2026-05-03 11:39:30.000000', 6, 'e7657448-4e87-4be4-b934-3c68674ce471', '9R5NNB3P', 1, 'PENDIENTE', '2026-05-03 11:39:31.000000'),
(116, b'0', '2026-05-03 11:40:10.000000', 10, 'dca1ed66-c044-42d8-8232-062e74447c39', 'EU6JS6D7', 1, 'PENDIENTE', '2026-05-03 11:40:10.000000'),
(117, b'0', '2026-05-03 11:42:08.000000', 5, '3015840f-3efd-44c4-85a3-de5657cb37cd', 'M9SBAN7V', 1, 'PENDIENTE', '2026-05-03 11:42:08.000000'),
(118, b'0', '2026-05-03 11:42:45.000000', 7, '0b8e497b-7b80-42ea-a5fc-7512c4b9a208', 'JMN3H9EQ', 1, 'INDIVIDUAL', '2026-05-03 11:44:01.000000'),
(119, b'0', '2026-05-03 11:47:47.000000', 7, 'fc2e3fe0-3d47-480e-ae1e-5c4ba1650a0f', 'ADWVVRKC', 1, 'PENDIENTE', '2026-05-03 11:47:47.000000'),
(120, b'0', '2026-05-03 12:00:43.000000', 7, '7a6577b0-2957-4d76-abfc-8221a60e0ef7', 'T8NCF9F7', 1, 'PENDIENTE', '2026-05-03 12:00:43.000000'),
(121, b'0', '2026-05-03 12:09:19.000000', 2, '2e6636e1-c2f0-451a-b4a3-a4b7ed047059', 'V6SP7ZU3', 1, 'INDIVIDUAL', '2026-05-03 12:24:18.000000'),
(122, b'0', '2026-05-03 12:25:24.000000', 2, 'b94a8000-60b4-4fbe-a8da-f01dc80959bc', 'YXVJVFFK', 4, 'GRUPO', '2026-05-03 12:35:34.000000'),
(123, b'0', '2026-05-03 12:38:46.000000', 6, '5dd6fbc0-fca0-45c3-8a95-685733ea4d3e', 'JGJV33KD', 1, 'INDIVIDUAL', '2026-05-03 12:39:53.000000'),
(124, b'0', '2026-05-03 12:39:29.000000', 5, '957fc144-4a22-4cc5-a33e-0ab2a1e4f4a0', '73YVYCN9', 1, 'INDIVIDUAL', '2026-05-03 13:34:21.000000'),
(125, b'0', '2026-05-03 13:33:46.000000', 2, '10a3487b-328e-4def-8cb5-a6f50ef32e76', 'ZV8SGRKD', 1, 'PENDIENTE', '2026-05-03 13:33:46.000000'),
(126, b'0', '2026-05-03 18:26:28.000000', 5, 'f57fe18e-79d1-4367-bb4b-a74e3c3c635e', 'FJR43UNR', 1, 'PENDIENTE', '2026-05-03 18:26:28.000000'),
(127, b'0', '2026-05-03 18:26:42.000000', 5, '292ad9ee-c35a-440a-8069-2099f59957d7', 'F4UT7C3N', 1, 'INDIVIDUAL', '2026-05-03 19:07:19.000000'),
(128, b'0', '2026-05-03 18:28:01.000000', 2, 'ed880617-821b-4b6c-b1b3-f4be65b37eec', 'DHQWU6QP', 3, 'GRUPO', '2026-05-03 19:07:32.000000'),
(129, b'0', '2026-05-03 18:28:32.000000', 6, '7fc08594-8d9d-4400-93fd-73877b97df32', 'NZ329J3W', 1, 'PENDIENTE', '2026-05-03 18:28:32.000000'),
(130, b'0', '2026-05-03 19:07:57.000000', 2, 'cb9fd0b7-4110-4c07-a034-8373d9429be6', 'WM82MVXN', 1, 'INDIVIDUAL', '2026-05-03 19:13:42.000000'),
(131, b'1', '2026-05-03 19:13:58.000000', 2, 'a11ac97b-9b02-4a40-a1c5-f676f91fed46', 'DDKACTRW', 1, 'PENDIENTE', '2026-05-03 19:21:50.000000');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `carta`
--
ALTER TABLE `carta`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `cobro_persona`
--
ALTER TABLE `cobro_persona`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK97xtv7c62x5fcgy2jsijpgtk0` (`servicio_id`);

--
-- Indices de la tabla `comensal`
--
ALTER TABLE `comensal`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK8q4o710p2gd91pwdcqj4xsaq7` (`sesion_mesa_id`);

--
-- Indices de la tabla `configuracion_restaurante`
--
ALTER TABLE `configuracion_restaurante`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `empleado`
--
ALTER TABLE `empleado`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indices de la tabla `item_seccion`
--
ALTER TABLE `item_seccion`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_item_seccion` (`seccion_id`),
  ADD KEY `fk_item_plato` (`plato_id`);

--
-- Indices de la tabla `llamada_camarero`
--
ALTER TABLE `llamada_camarero`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKhfu6vutg50gardss5lkvfei6a` (`servicio_id`),
  ADD KEY `FKpue4yh4aubjgcd20iqbn9yh4m` (`sesion_mesa_id`);

--
-- Indices de la tabla `menu`
--
ALTER TABLE `menu`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UK_dia` (`dia`);

--
-- Indices de la tabla `menu_plato`
--
ALTER TABLE `menu_plato`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_menu_plato_menu` (`menu_id`),
  ADD KEY `FK_menu_plato_plato` (`plato_id`);

--
-- Indices de la tabla `pedido`
--
ALTER TABLE `pedido`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_pedido_plato` (`plato_id`),
  ADD KEY `fk_pedido_servicio` (`servicio_id`),
  ADD KEY `FKoni5hawlh0vbpvhl7hsyyhs9x` (`comensal_id`);

--
-- Indices de la tabla `plato`
--
ALTER TABLE `plato`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `producto`
--
ALTER TABLE `producto`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKid8vjxky5juk3fnuc1sb9qarf` (`proveedor_id`);

--
-- Indices de la tabla `proveedor`
--
ALTER TABLE `proveedor`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `seccion_carta`
--
ALTER TABLE `seccion_carta`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_seccion_carta` (`carta_id`);

--
-- Indices de la tabla `servicio`
--
ALTER TABLE `servicio`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `sesion_mesa`
--
ALTER TABLE `sesion_mesa`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UKltbx0rl0gsuohi4lblfyl597x` (`token`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `carta`
--
ALTER TABLE `carta`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `cobro_persona`
--
ALTER TABLE `cobro_persona`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=54;

--
-- AUTO_INCREMENT de la tabla `comensal`
--
ALTER TABLE `comensal`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT de la tabla `configuracion_restaurante`
--
ALTER TABLE `configuracion_restaurante`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `empleado`
--
ALTER TABLE `empleado`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de la tabla `item_seccion`
--
ALTER TABLE `item_seccion`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT de la tabla `llamada_camarero`
--
ALTER TABLE `llamada_camarero`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `menu`
--
ALTER TABLE `menu`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT de la tabla `menu_plato`
--
ALTER TABLE `menu_plato`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=148;

--
-- AUTO_INCREMENT de la tabla `pedido`
--
ALTER TABLE `pedido`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=202;

--
-- AUTO_INCREMENT de la tabla `plato`
--
ALTER TABLE `plato`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT de la tabla `producto`
--
ALTER TABLE `producto`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT de la tabla `proveedor`
--
ALTER TABLE `proveedor`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `seccion_carta`
--
ALTER TABLE `seccion_carta`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `servicio`
--
ALTER TABLE `servicio`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=51;

--
-- AUTO_INCREMENT de la tabla `sesion_mesa`
--
ALTER TABLE `sesion_mesa`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=132;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `cobro_persona`
--
ALTER TABLE `cobro_persona`
  ADD CONSTRAINT `FK97xtv7c62x5fcgy2jsijpgtk0` FOREIGN KEY (`servicio_id`) REFERENCES `servicio` (`id`);

--
-- Filtros para la tabla `comensal`
--
ALTER TABLE `comensal`
  ADD CONSTRAINT `FK8q4o710p2gd91pwdcqj4xsaq7` FOREIGN KEY (`sesion_mesa_id`) REFERENCES `sesion_mesa` (`id`);

--
-- Filtros para la tabla `item_seccion`
--
ALTER TABLE `item_seccion`
  ADD CONSTRAINT `fk_item_plato` FOREIGN KEY (`plato_id`) REFERENCES `plato` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_item_seccion` FOREIGN KEY (`seccion_id`) REFERENCES `seccion_carta` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `llamada_camarero`
--
ALTER TABLE `llamada_camarero`
  ADD CONSTRAINT `FKhfu6vutg50gardss5lkvfei6a` FOREIGN KEY (`servicio_id`) REFERENCES `servicio` (`id`),
  ADD CONSTRAINT `FKpue4yh4aubjgcd20iqbn9yh4m` FOREIGN KEY (`sesion_mesa_id`) REFERENCES `sesion_mesa` (`id`);

--
-- Filtros para la tabla `menu_plato`
--
ALTER TABLE `menu_plato`
  ADD CONSTRAINT `FK_menu_plato_menu` FOREIGN KEY (`menu_id`) REFERENCES `menu` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_menu_plato_plato` FOREIGN KEY (`plato_id`) REFERENCES `plato` (`id`) ON DELETE SET NULL;

--
-- Filtros para la tabla `pedido`
--
ALTER TABLE `pedido`
  ADD CONSTRAINT `FKoni5hawlh0vbpvhl7hsyyhs9x` FOREIGN KEY (`comensal_id`) REFERENCES `comensal` (`id`),
  ADD CONSTRAINT `fk_pedido_plato` FOREIGN KEY (`plato_id`) REFERENCES `plato` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_pedido_servicio` FOREIGN KEY (`servicio_id`) REFERENCES `servicio` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `producto`
--
ALTER TABLE `producto`
  ADD CONSTRAINT `FKid8vjxky5juk3fnuc1sb9qarf` FOREIGN KEY (`proveedor_id`) REFERENCES `proveedor` (`id`);

--
-- Filtros para la tabla `seccion_carta`
--
ALTER TABLE `seccion_carta`
  ADD CONSTRAINT `fk_seccion_carta` FOREIGN KEY (`carta_id`) REFERENCES `carta` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;