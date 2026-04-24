-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 24-04-2026 a las 16:21:16
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
(2, 'Raúl Fernandez', 'camarero1@test.es', '$2a$10$E9dK8r3HaEa9X4OtnNL7BOnjIOCkOjfp9BITUcdAM24BaFdudMKv.', '1777037709849_1777014985384_🥗 Lunch w Sphinxie_ Codziennie od poniedziałku do piątku w godzinach 12_00–15_00! 😋_Smacznie, szybko i w miłej atmosferze – idealny przystanek w środku dnia_ 🌞.png', 'CAMARERO', 'ACTIVO'),
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
(6, 'Lunes', 8);

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
(5, 'PRIMERO', 1, 2, 2),
(6, 'SEGUNDO', 2, 2, 6),
(7, 'POSTRE', 3, 2, 20),
(8, 'BEBIDA', 4, 2, 22),
(9, 'PRIMERO', 1, 3, 3),
(10, 'SEGUNDO', 2, 3, 7),
(11, 'POSTRE', 3, 3, 19),
(12, 'BEBIDA', 4, 3, 23),
(13, 'PRIMERO', 1, 4, 9),
(14, 'SEGUNDO', 2, 4, 8),
(15, 'POSTRE', 3, 4, 21),
(16, 'BEBIDA', 4, 4, 24),
(17, 'PRIMERO', 1, 5, 10),
(18, 'SEGUNDO', 2, 5, 11),
(19, 'POSTRE', 3, 5, 19),
(20, 'BEBIDA', 4, 5, 22),
(21, 'PRIMERO', 1, 6, 2),
(22, 'PRIMERO', 0, 6, 3);

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
  `persona` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `pedido`
--

INSERT INTO `pedido` (`id`, `mesa`, `estado`, `fecha_hora`, `plato_id`, `servicio_id`, `persona`) VALUES
(1, 1, 'Servido', '2026-04-19 13:10:00', 1, 1, NULL),
(2, 1, 'Servido', '2026-04-19 13:12:00', 3, 1, NULL),
(3, 2, 'Servido', '2026-04-19 13:25:00', 5, 2, NULL),
(4, 2, 'Servido', '2026-04-19 13:30:00', 22, 2, NULL),
(5, 3, 'Servido', '2026-04-19 14:05:00', 9, 3, NULL),
(6, 4, 'Servido', '2026-04-19 14:15:00', 19, 4, NULL),
(7, 1, 'Servido', '2026-04-17 12:50:00', 2, 5, NULL),
(8, 1, 'Servido', '2026-04-17 13:00:00', 13, 5, NULL),
(9, 2, 'Servido', '2026-04-17 13:20:00', 6, 6, NULL),
(10, 5, 'Servido', '2026-04-17 13:35:00', 24, 7, NULL),
(11, 3, 'Servido', '2026-04-14 13:05:00', 17, 8, NULL),
(12, 6, 'Servido', '2026-04-14 13:20:00', 10, 9, NULL),
(13, 2, 'Servido', '2026-04-14 14:00:00', 20, 10, NULL),
(14, 4, 'Servido', '2026-04-10 21:10:00', 7, 11, NULL),
(15, 7, 'Servido', '2026-04-10 21:20:00', 23, 12, NULL),
(16, 1, 'Servido', '2026-04-09 13:00:00', 4, 13, NULL),
(17, 3, 'Servido', '2026-04-09 13:10:00', 8, 14, NULL),
(18, 2, 'Servido', '2026-03-29 13:10:00', 1, 15, NULL),
(19, 2, 'Servido', '2026-03-29 13:15:00', 11, 15, NULL),
(20, 5, 'Servido', '2026-03-29 13:45:00', 19, 16, NULL),
(21, 1, 'Servido', '2026-03-24 12:40:00', 3, 1, NULL),
(22, 1, 'Servido', '2026-03-24 12:45:00', 22, 1, NULL),
(23, 3, 'Servido', '2026-03-24 13:05:00', 12, 2, NULL),
(24, 3, 'Servido', '2026-03-24 13:10:00', 21, 2, NULL),
(25, 4, 'Servido', '2026-03-18 14:00:00', 6, 3, NULL),
(26, 4, 'Servido', '2026-03-18 14:10:00', 23, 3, NULL),
(27, 6, 'Servido', '2026-03-18 21:00:00', 14, 4, NULL),
(28, 1, 'Servido', '2026-02-26 13:00:00', 5, 5, NULL),
(29, 1, 'Servido', '2026-02-26 13:15:00', 24, 5, NULL),
(30, 2, 'Servido', '2026-02-26 13:30:00', 9, 6, NULL),
(31, 3, 'Servido', '2026-02-21 14:05:00', 17, 7, NULL),
(32, 3, 'Servido', '2026-02-21 14:10:00', 10, 7, NULL),
(33, 5, 'Servido', '2026-02-21 21:30:00', 20, 8, NULL),
(34, 2, 'Servido', '2026-02-18 13:05:00', 2, 9, NULL),
(35, 2, 'Servido', '2026-02-18 13:15:00', 13, 9, NULL),
(36, 4, 'Servido', '2026-02-18 13:30:00', 7, 10, NULL),
(37, 4, 'Servido', '2026-02-18 13:35:00', 22, 10, NULL),
(38, 7, 'Servido', '2026-02-12 20:50:00', 11, 11, NULL),
(39, 7, 'Servido', '2026-02-12 21:00:00', 23, 11, NULL),
(40, 6, 'Servido', '2026-02-08 13:25:00', 18, 12, NULL),
(41, 1, 'Servido', '2026-04-20 18:11:02', 1, 17, NULL),
(42, 1, 'Servido', '2026-04-20 18:11:02', 1, 17, NULL),
(43, 1, 'Servido', '2026-04-20 18:11:02', 2, 17, NULL),
(44, 1, 'Servido', '2026-04-20 18:11:02', 3, 17, NULL),
(45, 1, 'Servido', '2026-04-20 18:11:02', 4, 17, NULL),
(46, 1, 'Servido', '2026-04-20 18:11:02', 6, 17, NULL),
(47, 1, 'Servido', '2026-04-20 18:11:02', 20, 17, NULL),
(48, 1, 'Servido', '2026-04-20 19:09:45', 1, 18, NULL),
(49, 1, 'Servido', '2026-04-20 19:09:45', 1, 18, NULL),
(50, 1, 'EnProceso', '2026-04-20 19:09:45', 2, 18, NULL),
(51, 1, 'EnProceso', '2026-04-20 19:09:45', 2, 18, NULL),
(61, 1, 'Servido', '2026-04-21 23:47:55', 1, 21, 1),
(62, 1, 'Servido', '2026-04-21 23:49:22', 1, 21, 1),
(83, 1, 'Servido', '2026-04-23 20:37:02', 1, 27, 1),
(84, 1, 'Servido', '2026-04-23 20:37:03', 2, 27, 1),
(85, 1, 'Servido', '2026-04-23 20:37:42', 1, 28, 1),
(86, 1, 'Servido', '2026-04-23 20:37:42', 2, 28, 1),
(87, 10, 'Servido', '2026-04-23 20:57:54', 1, 29, 2),
(88, 10, 'Servido', '2026-04-23 20:57:54', 2, 29, 2),
(89, 10, 'Servido', '2026-04-23 20:57:54', 6, 29, 2),
(90, 10, 'Servido', '2026-04-23 20:57:55', 1, 29, 1),
(91, 10, 'Servido', '2026-04-23 20:57:55', 2, 29, 1),
(92, 3, 'Servido', '2026-04-23 21:02:48', 1, 30, 1),
(93, 3, 'Servido', '2026-04-23 21:02:48', 5, 30, 1),
(94, 3, 'Servido', '2026-04-23 21:02:48', 10, 30, 1),
(95, 3, 'Servido', '2026-04-23 21:02:48', 13, 30, 1),
(96, 3, 'Servido', '2026-04-23 21:02:48', 18, 30, 1),
(97, 6, 'Servido', '2026-04-23 21:14:08', 5, 31, 1),
(98, 1, 'Servido', '2026-04-24 11:33:40', 1, 32, 1),
(99, 1, 'EnProceso', '2026-04-24 11:33:40', 4, 32, 1),
(100, 1, 'Servido', '2026-04-24 12:12:01', 2, 33, 1),
(101, 4, 'Pendiente', '2026-04-24 13:52:28', 2, 34, 2),
(102, 4, 'Pendiente', '2026-04-24 13:52:28', 3, 34, 1);

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
(1, 'Ensaladilla rusa', 'Russian salad', 'Patata, atun, huevo y mahonesa casera', 'Potato, tuna, egg and homemade mayo', 5.5, '1776960428382_7 tips para preparar la ensalada rusa perfecta y deliciosa.png', 'PRIMERO', 0, 0, '2026-03-01'),
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
(10, 'Patatas', 'Saco 25kg', 1.2, 50, 1),
(11, 'sss', 'ssss', 1, 2, 4),
(13, 'a', 'a', 1, 0, 5);

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
(3, 'Bebidas La Giralda', 'ventas@bebidasgiralda.es', '955 778 990'),
(4, 'Pedro', 'prueba@test.es', '77 777 777'),
(5, 'SS', 'sss@sss', 'ss');

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
(27, 1, 1, 'SIN_SOLICITUD', NULL, NULL, '2026-04-23 20:37:17.000000'),
(28, 1, 1, 'SIN_SOLICITUD', NULL, NULL, '2026-04-23 20:38:33.000000'),
(29, 1, 10, 'SIN_SOLICITUD', NULL, NULL, '2026-04-23 21:06:31.000000'),
(30, 1, 3, 'SIN_SOLICITUD', NULL, NULL, '2026-04-23 21:09:50.000000'),
(31, 1, 6, 'SIN_SOLICITUD', NULL, NULL, '2026-04-23 21:16:55.000000'),
(32, 1, 1, 'SIN_SOLICITUD', NULL, NULL, '2026-04-24 11:34:25.000000'),
(33, 1, 1, 'SIN_SOLICITUD', NULL, NULL, '2026-04-24 12:12:49.000000'),
(34, 1, 4, 'SIN_SOLICITUD', NULL, NULL, '2026-04-24 13:52:28.000000');

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
(1, b'0', '2026-04-20 18:09:26.000000', 1, '21a4226a-09fa-4d50-b53c-f6d55cbdf2aa', '', 0, '', NULL),
(2, b'0', '2026-04-20 19:04:35.000000', 1, '7dbe1e42-bd01-43a5-abd4-966848899329', '', 0, '', NULL),
(3, b'0', '2026-04-20 19:13:48.000000', 1, '03c8b6f5-3c43-4add-8d06-9eaec9245f7a', 'HY3C5L2H', 0, '', NULL),
(4, b'0', '2026-04-20 22:58:23.000000', 2, '93163259-3777-4486-a02c-eb334a897f67', 'DMZRTCDE', 0, '', NULL),
(5, b'0', '2026-04-20 23:09:33.000000', 1, '3e8e8f34-3e78-497c-8a09-fbe80f043a32', 'WVLSJ7W5', 0, '', NULL),
(6, b'0', '2026-04-20 23:10:21.000000', 4, 'befab650-aca6-4815-b7ce-bcb875af3612', '5GAD8L7F', 0, '', NULL),
(7, b'0', '2026-04-20 23:11:35.000000', 4, '87f9c559-6bb9-4aa1-86ac-6b325f87d462', '99SJHFRM', 0, '', NULL),
(8, b'0', '2026-04-20 23:11:54.000000', 1, '43695048-212c-4977-90fd-68cb754c1466', 'HG2RJ9ST', 0, '', NULL),
(9, b'0', '2026-04-20 23:17:58.000000', 2, '9813b462-f077-4305-b775-ff16e0a949a1', 'A2RQHZHE', 0, '', NULL),
(10, b'0', '2026-04-20 23:26:53.000000', 6, '60f6a3c3-6aa6-4ed0-978d-69c933c1d2b2', 'EKT3PW78', 0, '', NULL),
(11, b'0', '2026-04-20 23:30:13.000000', 3, '646a0cda-8920-4901-91db-1dbd03277181', '4SWPXD76', 0, '', NULL),
(12, b'0', '2026-04-20 23:30:14.000000', 3, '19057b07-a30d-4c23-a44d-9bfc779386bb', '9YY5Q3BA', 0, '', NULL),
(13, b'0', '2026-04-20 23:30:15.000000', 3, '85b27e3d-5f5b-4ccc-8c64-d6cb3989759f', 'Z57UHLSV', 0, '', NULL),
(14, b'0', '2026-04-20 23:32:18.000000', 2, '4ab575c9-02bb-4e56-9ff8-5da9f2ffe10a', 'LWKVWS7Z', 0, '', NULL),
(15, b'0', '2026-04-20 23:32:18.000000', 2, '4b529fa0-ca6c-4ef3-844b-8211b4b32666', 'YLLBRDQ2', 0, '', NULL),
(16, b'0', '2026-04-20 23:32:19.000000', 2, '9c503915-5936-4419-bd8c-7e7afefe2c68', 'U9X2B9T4', 0, '', NULL),
(17, b'0', '2026-04-20 23:32:19.000000', 2, 'e992af65-e3d0-4908-878c-dd6d0f9d1a7a', '5PPCJB9N', 0, '', NULL),
(18, b'0', '2026-04-20 23:32:19.000000', 2, '49c1b178-1eb3-402f-b447-eef60ad2d597', 'ELGL6794', 0, '', NULL),
(19, b'0', '2026-04-20 23:32:20.000000', 2, 'f4743bad-91db-4eb2-af69-ddae4ee24ce5', '53847PUU', 0, '', NULL),
(20, b'0', '2026-04-21 09:40:00.000000', 1, '50ef081e-46c9-47fd-9bb8-d5c8a3acddf4', 'CHT3UU9L', 0, '', NULL),
(21, b'0', '2026-04-21 09:40:00.000000', 1, '14d842c5-a42b-48f9-8202-9583c7e55246', 'R9FKQ75J', 0, '', NULL),
(22, b'0', '2026-04-21 09:40:00.000000', 1, '9078c454-5e7d-453f-a216-26df4f7a98f8', 'VZ76K9GG', 0, '', NULL),
(23, b'0', '2026-04-21 09:46:33.000000', 1, '18227d60-e6d3-4903-ba2b-fc10dc6bdf3a', 'GXD8RVXW', 0, '', NULL),
(24, b'0', '2026-04-21 09:46:33.000000', 1, '9797b9ec-ab8e-4f1c-abad-2d51ef478f21', '7YYL7E3H', 0, '', NULL),
(25, b'0', '2026-04-21 09:46:41.000000', 1, '72d1bfe0-ed8b-49b3-819e-27f99e914b5b', 'JVLR2BRA', 0, '', NULL),
(26, b'0', '2026-04-21 09:46:41.000000', 1, 'f97aaeb5-e0b2-4697-9002-65249d8b3464', 'QJYUPCMR', 0, '', NULL),
(27, b'0', '2026-04-21 09:46:41.000000', 1, '982cc4a7-aa32-4489-8bb1-5e908e250a52', 'NNZUC73Z', 0, '', NULL),
(28, b'0', '2026-04-21 09:46:46.000000', 1, '27073ccf-25f8-448b-b623-e9d8cd280240', 'A8RPMUH7', 0, '', NULL),
(29, b'0', '2026-04-21 09:46:46.000000', 1, 'e09d06c8-a4d7-4f96-8f42-796c59d073d5', '9S26UJ9E', 0, '', NULL),
(30, b'0', '2026-04-21 09:46:47.000000', 1, 'eb312c38-1efb-46e3-9536-b86522590498', 'GHFVC44F', 0, '', NULL),
(31, b'0', '2026-04-21 09:46:50.000000', 1, '513c3599-a561-4d46-9864-9d8407061809', 'UZC2KEG3', 0, '', NULL),
(32, b'0', '2026-04-21 09:46:52.000000', 1, '2a2a1bf5-9216-4ccb-9cc1-c4a3770bab87', 'XSV7YESZ', 0, '', NULL),
(33, b'0', '2026-04-21 09:46:58.000000', 1, '2759248f-7fea-4a27-aff4-1eb1248425e2', 'U7YS6WYA', 0, '', NULL),
(34, b'0', '2026-04-21 09:46:58.000000', 1, 'a8bb85d1-437f-4bd0-9700-906d98050751', 'PRYF4XYB', 0, '', NULL),
(35, b'0', '2026-04-21 09:46:58.000000', 1, 'e237ae38-34ad-456b-bf7a-2ff7be9757cf', 'PQ3NNAFV', 0, '', NULL),
(36, b'0', '2026-04-21 09:46:58.000000', 1, '1e140fa5-fd71-48da-9dc6-0dab8e8fecc0', 'GRHWY5TS', 0, '', NULL),
(37, b'0', '2026-04-21 09:46:58.000000', 1, '8503bdf9-0570-4614-ad76-221b9cd30e57', 'BP3E7VKT', 0, '', NULL),
(38, b'0', '2026-04-21 09:48:13.000000', 1, '5d15ff29-7586-4088-91a6-1b8dd4169a79', '8EZNZ2UZ', 0, '', NULL),
(39, b'0', '2026-04-21 09:48:14.000000', 1, '19013f59-d39a-4dc5-9c77-675851b4cc83', 'XT7RH4KP', 0, '', NULL),
(40, b'0', '2026-04-21 09:48:14.000000', 1, '04b6441b-c924-44c0-96b0-4c2f9945eedc', 'Y74MB7V6', 0, '', NULL),
(41, b'0', '2026-04-21 09:48:14.000000', 1, '653f4497-110d-40d4-bc63-c3a138cafa4b', 'W3GVNTD5', 0, '', NULL),
(42, b'0', '2026-04-21 09:48:14.000000', 1, 'ee1db0b6-ef6b-465e-a6a8-0d9fbfa534c7', '6SE7ZZ3G', 0, '', NULL),
(43, b'0', '2026-04-21 09:48:14.000000', 1, '4239322f-d64c-48c7-ba4f-1a07faf95562', '3VAPW3PC', 0, '', NULL),
(44, b'0', '2026-04-21 09:48:19.000000', 1, '22d68196-8e7d-442c-b85b-d282563267b0', 'VWVWRA4G', 0, '', NULL),
(45, b'0', '2026-04-21 09:48:19.000000', 1, '3a739338-cfce-4419-b719-c8f01600ad0d', 'XEMH622K', 0, '', NULL),
(46, b'0', '2026-04-21 09:48:19.000000', 1, '44ab1437-2c89-486c-b9d4-1352f36d4bd9', 'CZSGSFHU', 0, '', NULL),
(47, b'0', '2026-04-21 09:48:19.000000', 1, '30751878-24ca-4e58-b527-c56a61fc334b', 'F6G73LRW', 0, '', NULL),
(48, b'0', '2026-04-21 14:57:58.000000', 10, '896f42ec-59ea-44ec-8ccf-514e61025bb2', 'HV4PW7M3', 1, 'PENDIENTE', NULL),
(49, b'0', '2026-04-21 15:03:21.000000', 9, 'ccc48053-1713-44db-b249-f06e398a0691', 'J36QQNA7', 1, 'PENDIENTE', NULL),
(50, b'0', '2026-04-21 23:46:52.000000', 1, 'd8b69533-2579-4dd6-b9de-f560761969f0', 'XZQHGYKC', 1, 'INDIVIDUAL', NULL),
(51, b'0', '2026-04-21 23:53:05.000000', 2, '4286836c-ee58-44ef-b645-b74e7b0c196e', '7HGEZJSM', 1, 'PENDIENTE', NULL),
(52, b'0', '2026-04-21 23:53:25.000000', 3, '75de1301-1f6b-4a19-bcfc-4bbd7bd2f9b8', 'HZRAB4M8', 2, 'GRUPO', NULL),
(53, b'0', '2026-04-22 00:16:17.000000', 3, 'cbd74690-2e23-41ab-aab1-fb707cf86bff', 'B9E4NNR5', 1, 'PENDIENTE', NULL),
(54, b'0', '2026-04-22 00:42:03.000000', 3, '40c401ef-2d36-49fc-a4ca-03e83c8203a0', 'FSL4QT9G', 1, 'PENDIENTE', NULL),
(55, b'0', '2026-04-22 00:42:23.000000', 1, '4671fdfa-9aa7-4a84-85f0-e2bd251a38e4', 'MRUU75B8', 1, 'PENDIENTE', NULL),
(56, b'0', '2026-04-22 00:43:17.000000', 2, '3b7d8d7c-ac9c-428d-988c-54a60babac40', 'RRTJVBAX', 1, 'PENDIENTE', NULL),
(57, b'0', '2026-04-22 00:43:41.000000', 2, 'fc169ca2-5722-4b40-8f09-18733bac0e02', 'ZTUYYVP8', 1, 'PENDIENTE', NULL),
(58, b'0', '2026-04-22 00:44:24.000000', 2, '1e41129b-4ae9-44ca-a946-1b559ec07e5d', 'HYJ5M7QK', 1, 'PENDIENTE', NULL),
(59, b'0', '2026-04-22 00:44:50.000000', 4, '7c8c2eb9-1525-4236-af51-7f793f1eb014', 'VJ8A8NZ3', 1, 'PENDIENTE', NULL),
(60, b'0', '2026-04-22 00:45:50.000000', 6, 'd2316259-266b-407f-8654-15d39c0e916c', 'UA8CSFU9', 1, 'PENDIENTE', NULL),
(61, b'0', '2026-04-22 09:46:13.000000', 1, '939ff8b0-2361-4105-8e14-a3688ce3d2d6', 'XYEXTUDK', 1, 'INDIVIDUAL', NULL),
(62, b'0', '2026-04-22 11:43:17.000000', 1, '5057cdfd-df23-453b-a88b-e8c25f30ec37', 'QN5HL35T', 2, 'GRUPO', NULL),
(63, b'0', '2026-04-22 11:46:41.000000', 1, '556fba73-61c0-4c43-bbad-b896f564dfc4', 'GTDS6WDT', 1, 'PENDIENTE', NULL),
(64, b'0', '2026-04-22 11:46:50.000000', 1, 'd0c62990-0d18-4f73-82ad-0dbebcdb03ca', 'B9M5WH2Z', 1, 'INDIVIDUAL', NULL),
(65, b'0', '2026-04-22 13:51:03.000000', 1, '02a47f90-f540-49ac-befd-1b454e6d89fc', '7CD3X4SB', 1, 'INDIVIDUAL', NULL),
(66, b'0', '2026-04-22 14:47:41.000000', 2, '93b85141-97dc-4a2e-9e1b-525ba9992b80', '3R2T6Q9N', 1, 'INDIVIDUAL', NULL),
(67, b'0', '2026-04-22 14:49:11.000000', 3, 'f866addf-02a4-47ef-a052-2efa779f56af', 'L8MHX6AE', 1, 'INDIVIDUAL', NULL),
(68, b'0', '2026-04-22 15:19:18.000000', 5, '4f98dbdd-6175-403f-965a-3ca0abdd8f44', '9ZS3F7Q9', 1, 'PENDIENTE', NULL),
(69, b'0', '2026-04-23 18:33:28.000000', 1, 'b41e8a88-0434-4686-806b-32b936a096f3', '3QUAM6GS', 1, 'INDIVIDUAL', '2026-04-23 18:33:53.000000'),
(70, b'0', '2026-04-23 20:36:53.000000', 1, '83098bda-0040-4015-861b-2a8dd2f045d6', '2ESTJV2D', 1, 'INDIVIDUAL', '2026-04-23 20:37:17.000000'),
(71, b'0', '2026-04-23 20:37:23.000000', 1, 'a56d8c41-91f0-40e2-9dd3-06a00222c85a', '89EKUG4N', 1, 'INDIVIDUAL', '2026-04-23 20:38:33.000000'),
(72, b'0', '2026-04-23 20:38:52.000000', 1, '493be397-d156-422f-97cb-57cc8f04180d', 'CGB2EQNJ', 1, 'INDIVIDUAL', '2026-04-23 20:50:55.000000'),
(73, b'0', '2026-04-23 20:52:42.000000', 2, 'ea1b73ac-5f91-47a9-9659-e440d50d7bc4', '2N8ZSY5V', 1, 'INDIVIDUAL', '2026-04-23 20:52:44.000000'),
(74, b'0', '2026-04-23 20:55:56.000000', 10, 'c95d9fa4-bc55-4e0f-b089-818332a8aed4', '5U5W8Q7T', 2, 'GRUPO', '2026-04-23 21:06:31.000000'),
(75, b'0', '2026-04-23 20:56:54.000000', 4, '277b777d-d2a2-4794-9b5c-b2fcdba7c49b', 'QUG69N2F', 1, 'INDIVIDUAL', '2026-04-23 21:14:34.000000'),
(76, b'0', '2026-04-23 21:01:52.000000', 3, '057c5eac-8b89-49e0-8333-a3fd8dd8ca6e', 'WNZPNJE6', 1, 'PENDIENTE', '2026-04-23 21:09:50.000000'),
(77, b'0', '2026-04-23 21:01:52.000000', 3, 'f0065075-aea5-4efb-96c6-471532d743a9', 'NDC7MXJW', 1, 'GRUPO', '2026-04-23 21:09:50.000000'),
(78, b'0', '2026-04-23 21:12:23.000000', 6, 'c4d19109-eb97-4f23-a33f-4137cc81d640', '48FK8YRP', 1, 'INDIVIDUAL', '2026-04-23 21:16:55.000000'),
(79, b'0', '2026-04-23 21:24:05.000000', 10, '1c47b727-cc5e-4a7b-8495-c84d8987d31a', '5LWTHAW6', 1, 'PENDIENTE', '2026-04-23 21:24:05.000000'),
(80, b'0', '2026-04-23 21:26:40.000000', 10, '37cb52e8-da6a-4580-95cd-f42303a197eb', 'XCQ23Y43', 1, 'PENDIENTE', '2026-04-23 21:26:40.000000'),
(81, b'0', '2026-04-24 10:08:36.000000', 1, '957d1d1f-96e4-430d-b87a-5ee766880a8a', '8PGWXGBS', 1, 'PENDIENTE', '2026-04-24 10:08:36.000000'),
(82, b'0', '2026-04-24 10:10:58.000000', 2, '0fa4b78b-ff15-437c-a7e4-a3bb4791d673', 'ZM6VPTZL', 1, 'PENDIENTE', '2026-04-24 10:10:58.000000'),
(83, b'0', '2026-04-24 11:33:08.000000', 1, '0ecbac01-d040-4715-bbf5-b1b8e9277a95', 'Y794UWX4', 1, 'INDIVIDUAL', '2026-04-24 11:34:25.000000'),
(84, b'0', '2026-04-24 11:54:47.000000', 2, '77b74de9-7f30-4f44-9f69-cf2d6506f795', 'CWJMJTZG', 1, 'PENDIENTE', '2026-04-24 11:54:48.000000'),
(85, b'0', '2026-04-24 12:10:10.000000', 1, '54ee3588-c4ba-4f8f-aa6a-8e08dad664b1', '2D8YW64Q', 1, 'INDIVIDUAL', '2026-04-24 12:12:49.000000'),
(86, b'0', '2026-04-24 12:10:18.000000', 2, 'f4603695-fb98-49ce-ad5f-f882c6c23d8e', '3PSCHXCS', 1, 'GRUPO', '2026-04-24 12:14:58.000000'),
(87, b'0', '2026-04-24 12:13:27.000000', 1, 'ed49113d-6396-4d19-8ec8-2de5bd156444', 'RW66EDGH', 1, 'GRUPO', '2026-04-24 12:14:06.000000'),
(88, b'0', '2026-04-24 13:51:50.000000', 4, '22ff30c1-95f7-40e9-802b-77e22273aea0', 'CKN2WE3P', 1, 'INDIVIDUAL', '2026-04-24 13:52:28.000000');

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
  ADD KEY `fk_pedido_servicio` (`servicio_id`);

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
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT de la tabla `configuracion_restaurante`
--
ALTER TABLE `configuracion_restaurante`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `empleado`
--
ALTER TABLE `empleado`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `item_seccion`
--
ALTER TABLE `item_seccion`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT de la tabla `menu`
--
ALTER TABLE `menu`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `menu_plato`
--
ALTER TABLE `menu_plato`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT de la tabla `pedido`
--
ALTER TABLE `pedido`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=103;

--
-- AUTO_INCREMENT de la tabla `plato`
--
ALTER TABLE `plato`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT de la tabla `producto`
--
ALTER TABLE `producto`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT de la tabla `proveedor`
--
ALTER TABLE `proveedor`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `seccion_carta`
--
ALTER TABLE `seccion_carta`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `servicio`
--
ALTER TABLE `servicio`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

--
-- AUTO_INCREMENT de la tabla `sesion_mesa`
--
ALTER TABLE `sesion_mesa`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=89;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `cobro_persona`
--
ALTER TABLE `cobro_persona`
  ADD CONSTRAINT `FK97xtv7c62x5fcgy2jsijpgtk0` FOREIGN KEY (`servicio_id`) REFERENCES `servicio` (`id`);

--
-- Filtros para la tabla `item_seccion`
--
ALTER TABLE `item_seccion`
  ADD CONSTRAINT `fk_item_plato` FOREIGN KEY (`plato_id`) REFERENCES `plato` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_item_seccion` FOREIGN KEY (`seccion_id`) REFERENCES `seccion_carta` (`id`) ON DELETE CASCADE;

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
