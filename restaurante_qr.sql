-- MariaDB dump 10.19  Distrib 10.4.32-MariaDB, for Win64 (AMD64)
--
-- Host: localhost    Database: restaurante_qr
-- ------------------------------------------------------
-- Server version    10.4.32-MariaDB

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

LOCK TABLES `configuracion_restaurante` WRITE;
/*!40000 ALTER TABLE `configuracion_restaurante` DISABLE KEYS */;
INSERT INTO `configuracion_restaurante` VALUES
(1,'#b45309','#065f46',NULL,NULL,'Bar La Alameda','Calle Real 18, Sevilla','info@barlaalameda.es','es,en','954000111');
/*!40000 ALTER TABLE `configuracion_restaurante` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `empleado`
--

DROP TABLE IF EXISTS `empleado`;
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
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

LOCK TABLES `empleado` WRITE;
/*!40000 ALTER TABLE `empleado` DISABLE KEYS */;
-- Contrasena para todos: 1234
INSERT INTO `empleado` VALUES
(1,'Gerente ','gerente@test.es','$2a$10$E9dK8r3HaEa9X4OtnNL7BOnjIOCkOjfp9BITUcdAM24BaFdudMKv.','', 'GERENTE','ACTIVO'),
(2,'Raúl Fernandez','camarero1@test.es','$2a$10$E9dK8r3HaEa9X4OtnNL7BOnjIOCkOjfp9BITUcdAM24BaFdudMKv.','', 'CAMARERO','ACTIVO'),
(3,'Alba Romero','camarero2@test.es','$2a$10$E9dK8r3HaEa9X4OtnNL7BOnjIOCkOjfp9BITUcdAM24BaFdudMKv.','', 'CAMARERO','ACTIVO'),
(4,'Jose Manuel Vega','cocinero1@test.es','$2a$10$E9dK8r3HaEa9X4OtnNL7BOnjIOCkOjfp9BITUcdAM24BaFdudMKv.','', 'COCINERO','ACTIVO'),
(5,'Carmen Ruiz','cocinero2@test.es','$2a$10$E9dK8r3HaEa9X4OtnNL7BOnjIOCkOjfp9BITUcdAM24BaFdudMKv.','', 'COCINERO','ACTIVO'),
(6,'Admin Pruebas','admin@test.es','$2a$10$E9dK8r3HaEa9X4OtnNL7BOnjIOCkOjfp9BITUcdAM24BaFdudMKv.','', 'GERENTE','ACTIVO');
/*!40000 ALTER TABLE `empleado` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `plato`
--

DROP TABLE IF EXISTS `plato`;
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
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

LOCK TABLES `plato` WRITE;
/*!40000 ALTER TABLE `plato` DISABLE KEYS */;
INSERT INTO `plato` VALUES
(1,'Ensaladilla rusa','Russian salad','Patata, atun, huevo y mahonesa casera','Potato, tuna, egg and homemade mayo',5.5,'ensaladilla.png','PRIMERO',1,0,'2026-03-01'),
(2,'Salmorejo cordobes','Cordoban salmorejo','Crema fria de tomate con jamon y huevo','Cold tomato cream with ham and egg',5.8,'salmorejo.png','PRIMERO',1,0,'2026-03-01'),
(3,'Croquetas de jamon','Iberian ham croquettes','Croquetas caseras crujientes','Homemade crispy croquettes',7.2,'croquetas_jamon.png','PRIMERO',1,1,'2026-03-05'),
(4,'Flamenquin','Flamenquin','Lomo enrollado con jamon serrano','Pork loin roll with serrano ham',9.5,'flamenquin.png','PRIMERO',1,0,'2026-03-06'),
(5,'Secreto iberico','Iberian pork secreto','A la plancha con patatas fritas','Grilled with fries',14.9,'secreto_iberico.png','SEGUNDO',1,1,'2026-03-08'),
(6,'Solomillo al whisky','Pork tenderloin in whisky sauce','Receta tradicional sevillana','Traditional Seville style recipe',13.5,'solomillo_whisky.png','SEGUNDO',1,0,'2026-03-08'),
(7,'Carrillada al vino tinto','Pork cheeks in red wine','Coccion lenta con salsa de vino','Slow cooked with red wine sauce',15.0,'carrillada.png','SEGUNDO',1,0,'2026-03-08'),
(8,'Presa iberica','Iberian presa','Carne jugosa a la brasa','Juicy grilled cut',16.0,'presa_iberica.png','SEGUNDO',1,0,'2026-03-09'),
(9,'Chocos fritos','Fried cuttlefish','Racion de chocos al estilo de Huelva','Huelva style fried cuttlefish',10.9,'chocos.png','TERCERO',1,0,'2026-03-10'),
(10,'Boquerones fritos','Fried anchovies','Boqueron fresco en fritura andaluza','Fresh anchovies, Andalusian fried style',9.8,'boquerones.png','TERCERO',1,0,'2026-03-10'),
(11,'Bacalao confitado','Confit cod','Con pimientos asados','With roasted peppers',14.0,'bacalao.png','TERCERO',1,0,'2026-03-11'),
(12,'Atun encebollado','Tuna with onion sauce','Atun guisado con cebolla','Stewed tuna with onion',13.8,'atun_encebollado.png','TERCERO',1,1,'2026-03-11'),
(13,'Serranito','Serranito sandwich','Lomo, jamon serrano y pimiento verde','Pork loin, serrano ham and green pepper',7.0,'serranito.png','SEGUNDO',1,0,'2026-03-12'),
(14,'Bocadillo de calamares','Calamari sandwich','Calamares fritos con alioli','Fried calamari with aioli',7.5,'bocata_calamares.png','SEGUNDO',1,0,'2026-03-12'),
(15,'Montadito de pringa','Pringa mini sandwich','Carne melosa del puchero andaluz','Shredded stew meat in bread',4.8,'montadito_pringa.png','SEGUNDO',1,0,'2026-03-12'),
(16,'Bocadillo de lomo','Pork loin sandwich','Lomo plancha con tomate','Grilled pork loin with tomato',6.8,'bocata_lomo.png','SEGUNDO',1,0,'2026-03-12'),
(17,'Paella mixta de la casa','House mixed paella','Especialidad para compartir','House specialty to share',14.5,'paella_casa.png','PRIMERO',1,1,'2026-03-14'),
(18,'Arroz meloso de marisco','Creamy seafood rice','Arroz caldoso con marisco fresco','Creamy rice with fresh seafood',15.2,'arroz_marisco.png','PRIMERO',1,0,'2026-03-14'),
(19,'Tarta de queso al horno','Baked cheesecake','Con mermelada de frutos rojos','With berry jam',5.2,'tarta_queso.png','POSTRE',1,0,'2026-03-15'),
(20,'Tocino de cielo','Spanish egg yolk custard','Dulce tradicional andaluz','Traditional Andalusian dessert',4.8,'tocino_cielo.png','POSTRE',1,0,'2026-03-15'),
(21,'Flan casero','Homemade flan','Con nata montada','With whipped cream',4.5,'flan.png','POSTRE',1,0,'2026-03-15'),
(22,'Cerveza de barril','Draft beer','Cana fria','Cold draft beer',2.2,'cerveza.png','BEBIDA',1,0,'2026-03-16'),
(23,'Tinto de verano','Summer red wine','Con limon','With lemon soda',3.0,'tinto_verano.png','BEBIDA',1,0,'2026-03-16'),
(24,'Agua mineral','Mineral water','Botella de agua 50cl','50cl bottled water',1.8,'agua.png','BEBIDA',1,0,'2026-03-16');
/*!40000 ALTER TABLE `plato` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `carta`
--

DROP TABLE IF EXISTS `carta`;
CREATE TABLE `carta` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) DEFAULT NULL,
  `imagen_banner` varchar(255) DEFAULT NULL,
  `activa` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

LOCK TABLES `carta` WRITE;
/*!40000 ALTER TABLE `carta` DISABLE KEYS */;
INSERT INTO `carta` VALUES (1,'Carta Bar La Alameda',NULL,1);
/*!40000 ALTER TABLE `carta` ENABLE KEYS */;
UNLOCK TABLES;

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
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

LOCK TABLES `seccion_carta` WRITE;
/*!40000 ALTER TABLE `seccion_carta` DISABLE KEYS */;
INSERT INTO `seccion_carta` VALUES
(1,'Entrantes','Starters',0,1),
(2,'Carnes','Meats',1,1),
(3,'Pescados','Fish',2,1),
(4,'Bocadillos','Sandwiches',3,1),
(5,'Especialidad de la casa','House specialty',4,1),
(6,'Postres','Desserts',5,1),
(7,'Bebidas','Drinks',6,1);
/*!40000 ALTER TABLE `seccion_carta` ENABLE KEYS */;
UNLOCK TABLES;

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
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

LOCK TABLES `item_seccion` WRITE;
/*!40000 ALTER TABLE `item_seccion` DISABLE KEYS */;
INSERT INTO `item_seccion` VALUES
(1,0,1,1),(2,1,1,2),(3,2,1,3),(4,3,1,4),
(5,0,2,5),(6,1,2,6),(7,2,2,7),(8,3,2,8),
(9,0,3,9),(10,1,3,10),(11,2,3,11),(12,3,3,12),
(13,0,4,13),(14,1,4,14),(15,2,4,15),(16,3,4,16),
(17,0,5,17),(18,1,5,18),
(19,0,6,19),(20,1,6,20),(21,2,6,21),
(22,0,7,22),(23,1,7,23),(24,2,7,24);
/*!40000 ALTER TABLE `item_seccion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `servicio`
--

DROP TABLE IF EXISTS `servicio`;
CREATE TABLE `servicio` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `estado` tinyint(4) DEFAULT NULL,
  `mesa` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

LOCK TABLES `servicio` WRITE;
/*!40000 ALTER TABLE `servicio` DISABLE KEYS */;
-- Servicios historicos cerrados (sin mesas activas hoy)
INSERT INTO `servicio` VALUES
(1,1,1),(2,1,2),(3,1,3),(4,1,4),
(5,1,1),(6,1,2),(7,1,5),
(8,1,3),(9,1,6),(10,1,2),
(11,1,4),(12,1,7),
(13,1,1),(14,1,3),
(15,1,2),(16,1,5);
/*!40000 ALTER TABLE `servicio` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pedido`
--

DROP TABLE IF EXISTS `pedido`;
CREATE TABLE `pedido` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `mesa` int(11) DEFAULT NULL,
  `estado` varchar(50) DEFAULT NULL,
  `fecha_hora` datetime DEFAULT current_timestamp(),
  `plato_id` bigint(20) DEFAULT NULL,
  `servicio_id` bigint(20) DEFAULT NULL,
  `persona` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_pedido_plato` (`plato_id`),
  KEY `fk_pedido_servicio` (`servicio_id`),
  CONSTRAINT `fk_pedido_plato` FOREIGN KEY (`plato_id`) REFERENCES `plato` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_pedido_servicio` FOREIGN KEY (`servicio_id`) REFERENCES `servicio` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

LOCK TABLES `pedido` WRITE;
/*!40000 ALTER TABLE `pedido` DISABLE KEYS */;
-- Pedidos de muestra (todos servidos): ayer, varios dias de abril, marzo y febrero
INSERT INTO `pedido` VALUES
-- Ayer (2026-04-19)
(1,1,'Servido','2026-04-19 13:10:00',1,1,NULL),
(2,1,'Servido','2026-04-19 13:12:00',3,1,NULL),
(3,2,'Servido','2026-04-19 13:25:00',5,2,NULL),
(4,2,'Servido','2026-04-19 13:30:00',22,2,NULL),
(5,3,'Servido','2026-04-19 14:05:00',9,3,NULL),
(6,4,'Servido','2026-04-19 14:15:00',19,4,NULL),

-- Hace varios dias (abril 2026)
(7,1,'Servido','2026-04-17 12:50:00',2,5,NULL),
(8,1,'Servido','2026-04-17 13:00:00',13,5,NULL),
(9,2,'Servido','2026-04-17 13:20:00',6,6,NULL),
(10,5,'Servido','2026-04-17 13:35:00',24,7,NULL),
(11,3,'Servido','2026-04-14 13:05:00',17,8,NULL),
(12,6,'Servido','2026-04-14 13:20:00',10,9,NULL),
(13,2,'Servido','2026-04-14 14:00:00',20,10,NULL),
(14,4,'Servido','2026-04-10 21:10:00',7,11,NULL),
(15,7,'Servido','2026-04-10 21:20:00',23,12,NULL),
(16,1,'Servido','2026-04-09 13:00:00',4,13,NULL),
(17,3,'Servido','2026-04-09 13:10:00',8,14,NULL),

-- Mes pasado (marzo 2026)
(18,2,'Servido','2026-03-29 13:10:00',1,15,NULL),
(19,2,'Servido','2026-03-29 13:15:00',11,15,NULL),
(20,5,'Servido','2026-03-29 13:45:00',19,16,NULL),
(21,1,'Servido','2026-03-24 12:40:00',3,1,NULL),
(22,1,'Servido','2026-03-24 12:45:00',22,1,NULL),
(23,3,'Servido','2026-03-24 13:05:00',12,2,NULL),
(24,3,'Servido','2026-03-24 13:10:00',21,2,NULL),
(25,4,'Servido','2026-03-18 14:00:00',6,3,NULL),
(26,4,'Servido','2026-03-18 14:10:00',23,3,NULL),
(27,6,'Servido','2026-03-18 21:00:00',14,4,NULL),

-- Hace un par de meses (febrero 2026)
(28,1,'Servido','2026-02-26 13:00:00',5,5,NULL),
(29,1,'Servido','2026-02-26 13:15:00',24,5,NULL),
(30,2,'Servido','2026-02-26 13:30:00',9,6,NULL),
(31,3,'Servido','2026-02-21 14:05:00',17,7,NULL),
(32,3,'Servido','2026-02-21 14:10:00',10,7,NULL),
(33,5,'Servido','2026-02-21 21:30:00',20,8,NULL),
(34,2,'Servido','2026-02-18 13:05:00',2,9,NULL),
(35,2,'Servido','2026-02-18 13:15:00',13,9,NULL),
(36,4,'Servido','2026-02-18 13:30:00',7,10,NULL),
(37,4,'Servido','2026-02-18 13:35:00',22,10,NULL),
(38,7,'Servido','2026-02-12 20:50:00',11,11,NULL),
(39,7,'Servido','2026-02-12 21:00:00',23,11,NULL),
(40,6,'Servido','2026-02-08 13:25:00',18,12,NULL);
/*!40000 ALTER TABLE `pedido` ENABLE KEYS */;
UNLOCK TABLES;

/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump refreshed on 2026-04-20

