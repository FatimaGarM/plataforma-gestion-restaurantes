-- MariaDB dump 10.19  Distrib 10.4.32-MariaDB, for Win64 (AMD64)
--
-- Host: localhost    Database: restaurante_qr
-- ------------------------------------------------------
-- Server version	10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `restaurante_qr`
--

/*!40000 DROP DATABASE IF EXISTS `restaurante_qr`*/;

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `restaurante_qr` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */;

USE `restaurante_qr`;

--
-- Table structure for table `configuracion_restaurante`
--

DROP TABLE IF EXISTS `configuracion_restaurante`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `configuracion_restaurante` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `color_primario` varchar(255) DEFAULT NULL,
  `color_secundario` varchar(255) DEFAULT NULL,
  `imagen_fondo` varchar(255) DEFAULT NULL,
  `logo` varchar(255) DEFAULT NULL,
  `nombre_restaurante` varchar(255) DEFAULT NULL,
  `direccion` varchar(255) DEFAULT NULL,
  `email_contacto` varchar(255) DEFAULT NULL,
  `idioma_carta` varchar(255) DEFAULT NULL,
  `telefono` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `configuracion_restaurante`
--

LOCK TABLES `configuracion_restaurante` WRITE;
/*!40000 ALTER TABLE `configuracion_restaurante` DISABLE KEYS */;
INSERT INTO `configuracion_restaurante` VALUES (1,'#f59e0b','#059669',NULL,NULL,'Mi Restaurante','','','es','');
/*!40000 ALTER TABLE `configuracion_restaurante` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `empleado`
--

DROP TABLE IF EXISTS `empleado`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `empleado` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `contraseña` varchar(255) DEFAULT NULL,
  `imagen` varchar(255) DEFAULT NULL,
  `tipo_empleado` varchar(50) DEFAULT NULL,
  `estado` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `empleado`
--

LOCK TABLES `empleado` WRITE;
/*!40000 ALTER TABLE `empleado` DISABLE KEYS */;
INSERT INTO `empleado` VALUES
(1,'Gerente','gerente@test.com','$2a$10$E9dK8r3HaEa9X4OtnNL7BOnjIOCkOjfp9BITUcdAM24BaFdudMKv.','','GERENTE','ACTIVO'),
(2,'Cocinero','cocinero@test.com','$2a$10$E9dK8r3HaEa9X4OtnNL7BOnjIOCkOjfp9BITUcdAM24BaFdudMKv.','','COCINERO','ACTIVO'),
(3,'Camarero','camarero@test.com','$2a$10$E9dK8r3HaEa9X4OtnNL7BOnjIOCkOjfp9BITUcdAM24BaFdudMKv.','','CAMARERO','ACTIVO'),
(4,'Ana López','ana@test.com','$2a$10$E9dK8r3HaEa9X4OtnNL7BOnjIOCkOjfp9BITUcdAM24BaFdudMKv.','','CAMARERO','ACTIVO'),
(5,'Carlos Ruiz','carlos@test.com','$2a$10$E9dK8r3HaEa9X4OtnNL7BOnjIOCkOjfp9BITUcdAM24BaFdudMKv.','','COCINERO','VACACIONES');
/*!40000 ALTER TABLE `empleado` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pedido`
--

DROP TABLE IF EXISTS `pedido`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `pedido` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `mesa` int(11) DEFAULT NULL,
  `estado` varchar(50) DEFAULT NULL,
  `fecha_hora` datetime DEFAULT current_timestamp(),
  `plato_id` bigint(20) DEFAULT NULL,
  `servicio_id` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_pedido_plato` (`plato_id`),
  KEY `fk_pedido_servicio` (`servicio_id`),
  CONSTRAINT `fk_pedido_plato` FOREIGN KEY (`plato_id`) REFERENCES `plato` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_pedido_servicio` FOREIGN KEY (`servicio_id`) REFERENCES `servicio` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=267 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pedido`
--

LOCK TABLES `pedido` WRITE;
/*!40000 ALTER TABLE `pedido` DISABLE KEYS */;
INSERT INTO `pedido` VALUES
-- ============================================================
-- HOY miércoles 2026-04-16: 18 pedidos (alto tráfico)
-- ============================================================
-- Desayuno (8-11)
(1,1,'Servido','2026-04-16 08:15:00',4,1),
(2,1,'Servido','2026-04-16 08:20:00',5,1),
(3,2,'Servido','2026-04-16 09:00:00',9,2),
(4,2,'Servido','2026-04-16 09:05:00',10,2),
(5,3,'Servido','2026-04-16 10:30:00',4,3),
-- Comida (12-16)
(6,1,'Servido','2026-04-16 12:30:00',1,1),
(7,1,'Servido','2026-04-16 12:35:00',2,1),
(8,2,'Servido','2026-04-16 13:00:00',6,2),
(9,2,'Servido','2026-04-16 13:10:00',7,2),
(10,3,'Servido','2026-04-16 13:20:00',8,3),
(11,3,'Servido','2026-04-16 13:25:00',11,3),
(12,4,'Servido','2026-04-16 14:00:00',1,4),
(13,4,'Servido','2026-04-16 14:05:00',3,4),
-- Activos (aún en servicio)
(14,5,'Pendiente','2026-04-16 14:30:00',6,5),
(15,5,'Pendiente','2026-04-16 14:30:00',12,5),
(16,6,'EnProceso','2026-04-16 14:35:00',7,6),
(17,6,'Pendiente','2026-04-16 14:35:00',11,6),
(18,7,'Pendiente','2026-04-16 14:40:00',1,7),

-- ============================================================
-- AYER martes 2026-04-15: 13 pedidos
-- ============================================================
-- Desayuno
(19,1,'Servido','2026-04-15 08:30:00',4,1),
(20,1,'Servido','2026-04-15 09:00:00',9,1),
(21,2,'Servido','2026-04-15 09:30:00',5,2),
-- Comida
(22,2,'Servido','2026-04-15 12:30:00',1,2),
(23,3,'Servido','2026-04-15 13:00:00',6,3),
(24,3,'Servido','2026-04-15 13:10:00',2,3),
(25,4,'Servido','2026-04-15 13:30:00',8,4),
(26,4,'Servido','2026-04-15 13:35:00',3,4),
(27,5,'Servido','2026-04-15 14:00:00',11,5),
-- Cena
(28,1,'Servido','2026-04-15 20:00:00',7,1),
(29,2,'Servido','2026-04-15 20:30:00',1,2),
(30,3,'Servido','2026-04-15 21:00:00',2,3),
(31,3,'Servido','2026-04-15 21:05:00',12,3),

-- ============================================================
-- LUNES 2026-04-14: 10 pedidos
-- ============================================================
(32,1,'Servido','2026-04-14 08:30:00',4,1),
(33,1,'Servido','2026-04-14 09:00:00',9,1),
(34,2,'Servido','2026-04-14 12:30:00',1,2),
(35,2,'Servido','2026-04-14 12:40:00',6,2),
(36,3,'Servido','2026-04-14 13:00:00',2,3),
(37,3,'Servido','2026-04-14 13:10:00',8,3),
(38,4,'Servido','2026-04-14 13:30:00',11,4),
(39,1,'Servido','2026-04-14 20:00:00',7,1),
(40,2,'Servido','2026-04-14 20:30:00',1,2),
(41,3,'Servido','2026-04-14 21:00:00',3,3),

-- ============================================================
-- DOMINGO 2026-04-13: 16 pedidos (fin de semana alto)
-- ============================================================
(42,1,'Servido','2026-04-13 08:30:00',4,1),
(43,1,'Servido','2026-04-13 08:45:00',5,1),
(44,2,'Servido','2026-04-13 09:00:00',9,2),
(45,2,'Servido','2026-04-13 09:10:00',4,2),
(46,1,'Servido','2026-04-13 13:00:00',1,1),
(47,2,'Servido','2026-04-13 13:05:00',2,2),
(48,2,'Servido','2026-04-13 13:10:00',6,2),
(49,3,'Servido','2026-04-13 13:20:00',3,3),
(50,3,'Servido','2026-04-13 13:25:00',7,3),
(51,3,'Servido','2026-04-13 13:30:00',8,3),
(52,4,'Servido','2026-04-13 14:00:00',11,4),
(53,4,'Servido','2026-04-13 20:00:00',1,4),
(54,5,'Servido','2026-04-13 20:10:00',2,5),
(55,5,'Servido','2026-04-13 20:30:00',6,5),
(56,6,'Servido','2026-04-13 20:45:00',12,6),
(57,6,'Servido','2026-04-13 21:00:00',7,6),

-- ============================================================
-- SÁBADO 2026-04-12: 18 pedidos (fin de semana pico)
-- ============================================================
(58,1,'Servido','2026-04-12 08:30:00',4,1),
(59,1,'Servido','2026-04-12 09:00:00',9,1),
(60,2,'Servido','2026-04-12 09:15:00',5,2),
(61,2,'Servido','2026-04-12 09:30:00',4,2),
(62,3,'Servido','2026-04-12 10:00:00',12,3),
(63,1,'Servido','2026-04-12 12:30:00',1,1),
(64,2,'Servido','2026-04-12 13:00:00',6,2),
(65,2,'Servido','2026-04-12 13:10:00',2,2),
(66,3,'Servido','2026-04-12 13:20:00',7,3),
(67,3,'Servido','2026-04-12 13:30:00',3,3),
(68,4,'Servido','2026-04-12 13:40:00',8,4),
(69,4,'Servido','2026-04-12 14:00:00',11,4),
(70,5,'Servido','2026-04-12 14:10:00',1,5),
(71,1,'Servido','2026-04-12 20:00:00',7,1),
(72,2,'Servido','2026-04-12 20:15:00',2,2),
(73,3,'Servido','2026-04-12 20:30:00',6,3),
(74,4,'Servido','2026-04-12 21:00:00',1,4),
(75,5,'Servido','2026-04-12 21:15:00',12,5),

-- ============================================================
-- VIERNES 2026-04-11: 14 pedidos
-- ============================================================
(76,1,'Servido','2026-04-11 08:30:00',4,1),
(77,1,'Servido','2026-04-11 09:00:00',9,1),
(78,2,'Servido','2026-04-11 09:30:00',10,2),
(79,1,'Servido','2026-04-11 12:30:00',1,1),
(80,1,'Servido','2026-04-11 12:40:00',2,1),
(81,2,'Servido','2026-04-11 13:00:00',6,2),
(82,3,'Servido','2026-04-11 13:15:00',7,3),
(83,3,'Servido','2026-04-11 13:20:00',3,3),
(84,4,'Servido','2026-04-11 13:30:00',8,4),
(85,4,'Servido','2026-04-11 14:00:00',11,4),
(86,1,'Servido','2026-04-11 20:00:00',1,1),
(87,2,'Servido','2026-04-11 20:30:00',7,2),
(88,3,'Servido','2026-04-11 20:45:00',2,3),
(89,4,'Servido','2026-04-11 21:00:00',6,4),

-- ============================================================
-- JUEVES 2026-04-10: 9 pedidos
-- ============================================================
(90,1,'Servido','2026-04-10 09:00:00',4,1),
(91,2,'Servido','2026-04-10 09:30:00',9,2),
(92,1,'Servido','2026-04-10 12:30:00',1,1),
(93,2,'Servido','2026-04-10 13:00:00',2,2),
(94,2,'Servido','2026-04-10 13:10:00',6,2),
(95,3,'Servido','2026-04-10 13:30:00',7,3),
(96,1,'Servido','2026-04-10 20:00:00',1,1),
(97,2,'Servido','2026-04-10 20:30:00',3,2),
(98,3,'Servido','2026-04-10 20:45:00',11,3),

-- ============================================================
-- MIÉRCOLES 2026-04-09: 8 pedidos
-- ============================================================
(99,1,'Servido','2026-04-09 08:45:00',4,1),
(100,1,'Servido','2026-04-09 12:30:00',6,1),
(101,2,'Servido','2026-04-09 13:00:00',1,2),
(102,2,'Servido','2026-04-09 13:10:00',8,2),
(103,3,'Servido','2026-04-09 13:20:00',2,3),
(104,3,'Servido','2026-04-09 20:00:00',7,3),
(105,4,'Servido','2026-04-09 20:30:00',3,4),
(106,4,'Servido','2026-04-09 21:00:00',12,4),

-- ============================================================
-- MARTES 2026-04-08: 7 pedidos
-- ============================================================
(107,1,'Servido','2026-04-08 09:00:00',4,1),
(108,1,'Servido','2026-04-08 12:30:00',1,1),
(109,2,'Servido','2026-04-08 13:00:00',2,2),
(110,2,'Servido','2026-04-08 13:15:00',6,2),
(111,3,'Servido','2026-04-08 13:30:00',8,3),
(112,1,'Servido','2026-04-08 20:00:00',7,1),
(113,2,'Servido','2026-04-08 20:30:00',11,2),

-- ============================================================
-- LUNES 2026-04-07: 6 pedidos
-- ============================================================
(114,1,'Servido','2026-04-07 08:30:00',9,1),
(115,1,'Servido','2026-04-07 12:30:00',1,1),
(116,2,'Servido','2026-04-07 13:00:00',2,2),
(117,2,'Servido','2026-04-07 13:10:00',3,2),
(118,3,'Servido','2026-04-07 20:00:00',6,3),
(119,3,'Servido','2026-04-07 20:30:00',7,3),

-- ============================================================
-- DOMINGO 2026-04-06: 13 pedidos
-- ============================================================
(120,1,'Servido','2026-04-06 08:30:00',4,1),
(121,1,'Servido','2026-04-06 09:00:00',9,1),
(122,2,'Servido','2026-04-06 09:15:00',12,2),
(123,1,'Servido','2026-04-06 12:30:00',1,1),
(124,2,'Servido','2026-04-06 13:00:00',6,2),
(125,2,'Servido','2026-04-06 13:10:00',2,2),
(126,3,'Servido','2026-04-06 13:20:00',7,3),
(127,3,'Servido','2026-04-06 13:30:00',8,3),
(128,4,'Servido','2026-04-06 14:00:00',3,4),
(129,1,'Servido','2026-04-06 20:00:00',1,1),
(130,2,'Servido','2026-04-06 20:15:00',2,2),
(131,3,'Servido','2026-04-06 20:30:00',6,3),
(132,4,'Servido','2026-04-06 21:00:00',11,4),

-- ============================================================
-- SÁBADO 2026-04-05: 15 pedidos
-- ============================================================
(133,1,'Servido','2026-04-05 08:30:00',4,1),
(134,1,'Servido','2026-04-05 09:00:00',9,1),
(135,2,'Servido','2026-04-05 09:30:00',4,2),
(136,1,'Servido','2026-04-05 12:30:00',1,1),
(137,2,'Servido','2026-04-05 13:00:00',6,2),
(138,2,'Servido','2026-04-05 13:10:00',7,2),
(139,3,'Servido','2026-04-05 13:20:00',2,3),
(140,3,'Servido','2026-04-05 13:30:00',3,3),
(141,4,'Servido','2026-04-05 14:00:00',8,4),
(142,4,'Servido','2026-04-05 14:10:00',11,4),
(143,1,'Servido','2026-04-05 20:00:00',1,1),
(144,2,'Servido','2026-04-05 20:30:00',7,2),
(145,3,'Servido','2026-04-05 20:45:00',2,3),
(146,4,'Servido','2026-04-05 21:00:00',6,4),
(147,5,'Servido','2026-04-05 21:15:00',12,5),

-- ============================================================
-- VIERNES 2026-04-04: 10 pedidos
-- ============================================================
(148,1,'Servido','2026-04-04 08:30:00',4,1),
(149,1,'Servido','2026-04-04 12:30:00',1,1),
(150,2,'Servido','2026-04-04 13:00:00',6,2),
(151,2,'Servido','2026-04-04 13:10:00',2,2),
(152,3,'Servido','2026-04-04 13:20:00',7,3),
(153,3,'Servido','2026-04-04 13:30:00',3,3),
(154,4,'Servido','2026-04-04 14:00:00',8,4),
(155,1,'Servido','2026-04-04 20:00:00',1,1),
(156,2,'Servido','2026-04-04 20:30:00',2,2),
(157,3,'Servido','2026-04-04 21:00:00',6,3),

-- ============================================================
-- JUEVES 2026-04-03: 7 pedidos
-- ============================================================
(158,1,'Servido','2026-04-03 09:00:00',9,1),
(159,1,'Servido','2026-04-03 12:30:00',1,1),
(160,2,'Servido','2026-04-03 13:00:00',2,2),
(161,2,'Servido','2026-04-03 13:15:00',6,2),
(162,3,'Servido','2026-04-03 20:00:00',7,3),
(163,3,'Servido','2026-04-03 20:30:00',3,3),
(164,4,'Servido','2026-04-03 20:45:00',1,4),

-- ============================================================
-- MIÉRCOLES 2026-04-02: 6 pedidos
-- ============================================================
(165,1,'Servido','2026-04-02 12:30:00',1,1),
(166,1,'Servido','2026-04-02 12:40:00',2,1),
(167,2,'Servido','2026-04-02 13:00:00',6,2),
(168,3,'Servido','2026-04-02 13:30:00',3,3),
(169,1,'Servido','2026-04-02 20:00:00',7,1),
(170,2,'Servido','2026-04-02 20:30:00',8,2),

-- ============================================================
-- MARTES 2026-04-01: 5 pedidos
-- ============================================================
(171,1,'Servido','2026-04-01 12:30:00',1,1),
(172,2,'Servido','2026-04-01 13:00:00',6,2),
(173,2,'Servido','2026-04-01 13:10:00',2,2),
(174,1,'Servido','2026-04-01 20:00:00',7,1),
(175,2,'Servido','2026-04-01 20:30:00',3,2),

-- ============================================================
-- LUNES 2026-03-31: 4 pedidos
-- ============================================================
(176,1,'Servido','2026-03-31 12:30:00',1,1),
(177,2,'Servido','2026-03-31 13:00:00',2,2),
(178,1,'Servido','2026-03-31 20:00:00',6,1),
(179,2,'Servido','2026-03-31 20:30:00',7,2),

-- ============================================================
-- DOMINGO 2026-03-30: 11 pedidos
-- ============================================================
(180,1,'Servido','2026-03-30 08:30:00',4,1),
(181,2,'Servido','2026-03-30 09:00:00',9,2),
(182,1,'Servido','2026-03-30 12:30:00',1,1),
(183,2,'Servido','2026-03-30 13:00:00',6,2),
(184,2,'Servido','2026-03-30 13:10:00',2,2),
(185,3,'Servido','2026-03-30 13:20:00',7,3),
(186,3,'Servido','2026-03-30 13:30:00',8,3),
(187,4,'Servido','2026-03-30 14:00:00',3,4),
(188,1,'Servido','2026-03-30 20:00:00',1,1),
(189,2,'Servido','2026-03-30 20:30:00',12,2),
(190,3,'Servido','2026-03-30 21:00:00',11,3),

-- ============================================================
-- SÁBADO 2026-03-29: 12 pedidos
-- ============================================================
(191,1,'Servido','2026-03-29 08:30:00',4,1),
(192,1,'Servido','2026-03-29 09:00:00',9,1),
(193,2,'Servido','2026-03-29 09:30:00',12,2),
(194,1,'Servido','2026-03-29 12:30:00',6,1),
(195,2,'Servido','2026-03-29 13:00:00',1,2),
(196,2,'Servido','2026-03-29 13:10:00',7,2),
(197,3,'Servido','2026-03-29 13:20:00',2,3),
(198,3,'Servido','2026-03-29 13:30:00',8,3),
(199,4,'Servido','2026-03-29 14:00:00',3,4),
(200,1,'Servido','2026-03-29 20:00:00',1,1),
(201,2,'Servido','2026-03-29 20:30:00',2,2),
(202,3,'Servido','2026-03-29 21:00:00',6,3),

-- ============================================================
-- VIERNES 2026-03-28: 9 pedidos
-- ============================================================
(203,1,'Servido','2026-03-28 09:00:00',4,1),
(204,1,'Servido','2026-03-28 12:30:00',1,1),
(205,2,'Servido','2026-03-28 13:00:00',6,2),
(206,2,'Servido','2026-03-28 13:10:00',2,2),
(207,3,'Servido','2026-03-28 13:30:00',7,3),
(208,3,'Servido','2026-03-28 14:00:00',3,3),
(209,1,'Servido','2026-03-28 20:00:00',1,1),
(210,2,'Servido','2026-03-28 20:30:00',8,2),
(211,3,'Servido','2026-03-28 21:00:00',11,3),

-- ============================================================
-- JUEVES 2026-03-27: 6 pedidos
-- ============================================================
(212,1,'Servido','2026-03-27 12:30:00',1,1),
(213,2,'Servido','2026-03-27 13:00:00',2,2),
(214,2,'Servido','2026-03-27 13:15:00',6,2),
(215,3,'Servido','2026-03-27 20:00:00',7,3),
(216,3,'Servido','2026-03-27 20:30:00',3,3),
(217,4,'Servido','2026-03-27 21:00:00',8,4),

-- ============================================================
-- MIÉRCOLES 2026-03-26: 5 pedidos
-- ============================================================
(218,1,'Servido','2026-03-26 12:30:00',1,1),
(219,2,'Servido','2026-03-26 13:00:00',6,2),
(220,2,'Servido','2026-03-26 13:10:00',2,2),
(221,1,'Servido','2026-03-26 20:00:00',7,1),
(222,2,'Servido','2026-03-26 20:30:00',12,2),

-- ============================================================
-- MARTES 2026-03-25: 4 pedidos
-- ============================================================
(223,1,'Servido','2026-03-25 12:30:00',1,1),
(224,2,'Servido','2026-03-25 13:00:00',2,2),
(225,1,'Servido','2026-03-25 20:00:00',6,1),
(226,2,'Servido','2026-03-25 20:30:00',3,2),

-- ============================================================
-- LUNES 2026-03-24: 3 pedidos
-- ============================================================
(227,1,'Servido','2026-03-24 12:30:00',1,1),
(228,2,'Servido','2026-03-24 13:00:00',7,2),
(229,1,'Servido','2026-03-24 20:00:00',2,1),

-- ============================================================
-- DOMINGO 2026-03-23: 8 pedidos
-- ============================================================
(230,1,'Servido','2026-03-23 08:30:00',4,1),
(231,2,'Servido','2026-03-23 09:00:00',9,2),
(232,1,'Servido','2026-03-23 12:30:00',1,1),
(233,2,'Servido','2026-03-23 13:00:00',6,2),
(234,3,'Servido','2026-03-23 13:20:00',2,3),
(235,1,'Servido','2026-03-23 20:00:00',7,1),
(236,2,'Servido','2026-03-23 20:30:00',3,2),
(237,3,'Servido','2026-03-23 21:00:00',8,3),

-- ============================================================
-- SÁBADO 2026-03-22: 10 pedidos
-- ============================================================
(238,1,'Servido','2026-03-22 08:30:00',4,1),
(239,2,'Servido','2026-03-22 09:30:00',9,2),
(240,1,'Servido','2026-03-22 12:30:00',6,1),
(241,2,'Servido','2026-03-22 13:00:00',1,2),
(242,2,'Servido','2026-03-22 13:10:00',7,2),
(243,3,'Servido','2026-03-22 13:20:00',2,3),
(244,3,'Servido','2026-03-22 14:00:00',3,3),
(245,1,'Servido','2026-03-22 20:00:00',1,1),
(246,2,'Servido','2026-03-22 20:30:00',6,2),
(247,3,'Servido','2026-03-22 21:00:00',8,3),

-- ============================================================
-- VIERNES 2026-03-21: 7 pedidos
-- ============================================================
(248,1,'Servido','2026-03-21 12:30:00',1,1),
(249,2,'Servido','2026-03-21 13:00:00',2,2),
(250,2,'Servido','2026-03-21 13:15:00',6,2),
(251,3,'Servido','2026-03-21 13:30:00',7,3),
(252,1,'Servido','2026-03-21 20:00:00',3,1),
(253,2,'Servido','2026-03-21 20:30:00',1,2),
(254,3,'Servido','2026-03-21 21:00:00',8,3),

-- ============================================================
-- JUEVES 2026-03-20: 5 pedidos
-- ============================================================
(255,1,'Servido','2026-03-20 12:30:00',1,1),
(256,2,'Servido','2026-03-20 13:00:00',6,2),
(257,3,'Servido','2026-03-20 13:30:00',2,3),
(258,1,'Servido','2026-03-20 20:00:00',7,1),
(259,2,'Servido','2026-03-20 20:30:00',3,2),

-- ============================================================
-- MIÉRCOLES 2026-03-19: 4 pedidos
-- ============================================================
(260,1,'Servido','2026-03-19 12:30:00',1,1),
(261,2,'Servido','2026-03-19 13:00:00',2,2),
(262,1,'Servido','2026-03-19 20:00:00',6,1),
(263,2,'Servido','2026-03-19 20:30:00',7,2),

-- ============================================================
-- MARTES 2026-03-18: 3 pedidos
-- ============================================================
(264,1,'Servido','2026-03-18 12:30:00',1,1),
(265,2,'Servido','2026-03-18 13:00:00',6,2),
(266,1,'Servido','2026-03-18 20:00:00',2,1);
/*!40000 ALTER TABLE `pedido` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `plato`
--

DROP TABLE IF EXISTS `plato`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `plato` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) DEFAULT NULL,
  `nombre_en` varchar(255) DEFAULT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  `descripcion_en` varchar(255) DEFAULT NULL,
  `precio` double DEFAULT NULL,
  `imagen` varchar(255) DEFAULT NULL,
  `tipo` varchar(50) DEFAULT NULL,
  `disponible` tinyint(1) DEFAULT NULL,
  `es_novedad` tinyint(1) DEFAULT 0,
  `fecha_creacion` date DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plato`
--

LOCK TABLES `plato` WRITE;
/*!40000 ALTER TABLE `plato` DISABLE KEYS */;
INSERT INTO `plato` VALUES
(1,'Pizza Margarita',NULL,'Pizza clásica con tomate y queso',NULL,8.5,'pizza.jpg','PRIMERO',1,0,'2026-01-10'),
(2,'Hamburguesa',NULL,'Hamburguesa con patatas',NULL,9.9,'hamburguesa.jpg','SEGUNDO',1,0,'2026-01-10'),
(3,'Ensalada César',NULL,'Ensalada fresca con pollo',NULL,6.5,'ensalada.jpg','PRIMERO',1,0,'2026-01-10'),
(4,'Tarta de queso',NULL,'Postre casero',NULL,4.5,'tarta.jpg','POSTRE',1,1,'2026-04-05'),
(5,'Coca-Cola',NULL,'Refresco',NULL,2.5,'cocacola.jpg','BEBIDA',1,1,'2026-04-08'),
(6,'Paella Valenciana',NULL,'Paella con marisco y verduras',NULL,12.0,'paella.jpg','PRIMERO',1,0,'2026-01-15'),
(7,'Solomillo a la plancha',NULL,'Solomillo de ternera con guarnición',NULL,15.5,'solomillo.jpg','SEGUNDO',1,0,'2026-01-20'),
(8,'Risotto de setas',NULL,'Risotto cremoso con setas variadas',NULL,11.0,'risotto.jpg','PRIMERO',1,1,'2026-04-01'),
(9,'Brownie con helado',NULL,'Brownie de chocolate con helado de vainilla',NULL,5.5,'brownie.jpg','POSTRE',1,0,'2026-02-01'),
(10,'Agua mineral',NULL,'Agua mineral natural',NULL,1.8,'agua.jpg','BEBIDA',1,0,'2026-01-10'),
(11,'Croquetas caseras',NULL,'Croquetas de jamón ibérico',NULL,7.0,'croquetas.jpg','PRIMERO',1,1,'2026-04-10'),
(12,'Tiramisú',NULL,'Postre italiano clásico',NULL,5.0,'tiramisu.jpg','POSTRE',1,1,'2026-03-25');
/*!40000 ALTER TABLE `plato` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `servicio`
--

DROP TABLE IF EXISTS `servicio`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `servicio` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `estado` tinyint(4) DEFAULT NULL,
  `mesa` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `servicio`
--

LOCK TABLES `servicio` WRITE;
/*!40000 ALTER TABLE `servicio` DISABLE KEYS */;
INSERT INTO `servicio` VALUES (1,1,1),(2,1,2),(3,1,3),(4,1,4),(5,1,5),(6,1,6),(7,1,7),(8,1,8),(9,1,9),(10,1,10);
/*!40000 ALTER TABLE `servicio` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-04-07 21:45:53

--
-- Table structure for table `carta`
--

DROP TABLE IF EXISTS `carta`;
CREATE TABLE `carta` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) DEFAULT NULL,
  `imagen_banner` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Table structure for table `seccion_carta`
--

DROP TABLE IF EXISTS `seccion_carta`;
CREATE TABLE `seccion_carta` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) DEFAULT NULL,
  `nombre_en` varchar(255) DEFAULT NULL,
  `orden` int(11) DEFAULT NULL,
  `carta_id` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_seccion_carta` (`carta_id`),
  CONSTRAINT `fk_seccion_carta` FOREIGN KEY (`carta_id`) REFERENCES `carta` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Table structure for table `item_seccion`
--

DROP TABLE IF EXISTS `item_seccion`;
CREATE TABLE `item_seccion` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `orden` int(11) DEFAULT NULL,
  `seccion_id` bigint(20) DEFAULT NULL,
  `plato_id` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_item_seccion` (`seccion_id`),
  KEY `fk_item_plato` (`plato_id`),
  CONSTRAINT `fk_item_seccion` FOREIGN KEY (`seccion_id`) REFERENCES `seccion_carta` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_item_plato` FOREIGN KEY (`plato_id`) REFERENCES `plato` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
