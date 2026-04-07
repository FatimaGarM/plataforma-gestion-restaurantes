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
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `empleado`
--

LOCK TABLES `empleado` WRITE;
/*!40000 ALTER TABLE `empleado` DISABLE KEYS */;
INSERT INTO `empleado` VALUES (1,'Gerente','gerente@test.com','$2a$10$I1L.j1XwPL5KCWNk7BpUB.so3SkFfbgQd5ohHW4LdC04lN5eWz4S2','','GERENTE','ACTIVO'),(2,'Cocinero','cocinero@test.com','$2a$10$PmjSPUqGIcX9pmSt0ipkT.XxuB/rNw07MagV6a4BbxQdr3u2FrtUC','','COCINERO','ACTIVO'),(3,'Camarero','camarero@test.com','$2a$10$T7zOT6sclvA7TGLrU.PaJe..KPo/0SPTbdf8A4yuVvdZt/91tDJn6','','CAMARERO','ACTIVO');
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
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pedido`
--

LOCK TABLES `pedido` WRITE;
/*!40000 ALTER TABLE `pedido` DISABLE KEYS */;
INSERT INTO `pedido` VALUES (1,1,'Pendiente','2026-03-27 20:04:12',1,1),(2,1,'Pendiente','2026-03-27 20:04:12',2,1);
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
  `descripcion` varchar(255) DEFAULT NULL,
  `precio` double DEFAULT NULL,
  `imagen` varchar(255) DEFAULT NULL,
  `tipo` varchar(50) DEFAULT NULL,
  `disponible` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plato`
--

LOCK TABLES `plato` WRITE;
/*!40000 ALTER TABLE `plato` DISABLE KEYS */;
INSERT INTO `plato` VALUES (1,'Pizza Margarita','Pizza clásica con tomate y queso',8.5,'pizza.jpg','PRIMERO',1),(2,'Hamburguesa','Hamburguesa con patatas',9.9,'hamburguesa.jpg','SEGUNDO',1),(3,'Ensalada César','Ensalada fresca con pollo',6.5,'ensalada.jpg','PRIMERO',1),(4,'Tarta de queso','Postre casero',4.5,'tarta.jpg','POSTRE',1),(5,'Coca-Cola','Refresco',2.5,'cocacola.jpg','BEBIDA',1);
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
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `servicio`
--

LOCK TABLES `servicio` WRITE;
/*!40000 ALTER TABLE `servicio` DISABLE KEYS */;
INSERT INTO `servicio` VALUES (1,1,1);
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
