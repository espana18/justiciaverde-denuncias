CREATE DATABASE  IF NOT EXISTS `justicia_verde_v2` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `justicia_verde_v2`;
-- MySQL dump 10.13  Distrib 8.0.44, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: justicia_verde
-- ------------------------------------------------------
-- Server version	8.4.7

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `demanda`
--

DROP TABLE IF EXISTS `demanda`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `demanda` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `numero_radicado` varchar(20) NOT NULL,
  `ciudadano_id` int unsigned NOT NULL,
  `titulo` varchar(160) NOT NULL,
  `descripcion` text NOT NULL,
  `tipo_demanda_id` smallint unsigned NOT NULL,
  `prioridad` enum('medio','alta','critica') NOT NULL DEFAULT 'medio',
  `estado` enum('en_revision','tomaron_el_caso') NOT NULL DEFAULT 'en_revision',
  `anonima` tinyint(1) NOT NULL DEFAULT '0',
  `ubicacion_texto` varchar(190) DEFAULT NULL,
  `latitud` decimal(10,7) DEFAULT NULL,
  `longitud` decimal(10,7) DEFAULT NULL,
  `publico` tinyint(1) NOT NULL DEFAULT '1',
  `creado_en` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `actualizado_en` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `numero_radicado` (`numero_radicado`),
  KEY `idx_demanda_estado` (`estado`),
  KEY `idx_demanda_prioridad` (`prioridad`),
  KEY `idx_demanda_ciudadano` (`ciudadano_id`),
  KEY `idx_demanda_tipo` (`tipo_demanda_id`),
  KEY `idx_demanda_geo` (`latitud`,`longitud`),
  CONSTRAINT `fk_demanda_tipo` FOREIGN KEY (`tipo_demanda_id`) REFERENCES `tipo_demanda` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `demanda`
--

LOCK TABLES `demanda` WRITE;
/*!40000 ALTER TABLE `demanda` DISABLE KEYS */;
INSERT INTO `demanda` VALUES (5,'RAD-20251119-0001',2,'contaminacion del agua','qqqqqqqqqqqqqqqqqq',3,'medio','tomaron_el_caso',1,'2.449436, -76.594733',2.4494364,-76.5947329,1,'2025-11-19 05:44:31','2025-11-19 05:47:16'),(6,'RAD-20251119-0002',2,'tala ilegal de arboles','oooooooooooo',5,'medio','en_revision',0,NULL,2.4495711,-76.5948089,1,'2025-11-19 06:07:52',NULL),(8,'RAD-20251119-0003',2,'contaminacion del agua','ppppppppppppppppp',3,'medio','en_revision',0,'2.449571, -76.594809',2.4495711,-76.5948089,1,'2025-11-19 06:11:11',NULL),(9,'RAD-20251119-0004',2,'INCENDIO EN BOGOTÁ','yyyyyyyyyyyy',4,'medio','en_revision',1,'2.449613, -76.594590',2.3276028,-76.6547012,1,'2025-11-19 06:12:12','2025-11-19 06:51:32'),(21,'RAD-20251119-0005',2,'contaminacion del agua','mmmmmmmmmmmmmmmm',3,'medio','en_revision',1,'2.439258, -76.555309',2.4392576,-76.5553093,1,'2025-11-19 07:17:17','2025-11-19 07:18:03');
/*!40000 ALTER TABLE `demanda` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `demanda_foto`
--

DROP TABLE IF EXISTS `demanda_foto`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `demanda_foto` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `demanda_id` bigint unsigned NOT NULL,
  `ruta` varchar(255) NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  `subido_en` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_foto_demanda` (`demanda_id`),
  CONSTRAINT `fk_foto_demanda` FOREIGN KEY (`demanda_id`) REFERENCES `demanda` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `demanda_foto`
--

LOCK TABLES `demanda_foto` WRITE;
/*!40000 ALTER TABLE `demanda_foto` DISABLE KEYS */;
/*!40000 ALTER TABLE `demanda_foto` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `demanda_revisor`
--

DROP TABLE IF EXISTS `demanda_revisor`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `demanda_revisor` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `demanda_id` bigint unsigned NOT NULL,
  `revisor_id` bigint unsigned NOT NULL,
  `asignado_en` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_demanda_revisor` (`demanda_id`,`revisor_id`),
  KEY `idx_asig_demanda` (`demanda_id`),
  KEY `idx_asig_revisor` (`revisor_id`),
  CONSTRAINT `fk_asig_demanda` FOREIGN KEY (`demanda_id`) REFERENCES `demanda` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_asig_revisor` FOREIGN KEY (`revisor_id`) REFERENCES `usuario` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `demanda_revisor`
--

LOCK TABLES `demanda_revisor` WRITE;
/*!40000 ALTER TABLE `demanda_revisor` DISABLE KEYS */;
INSERT INTO `demanda_revisor` VALUES (2,5,3,'2025-11-19 05:47:16');
/*!40000 ALTER TABLE `demanda_revisor` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notificacion`
--

DROP TABLE IF EXISTS `notificacion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notificacion` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `usuario_id` bigint unsigned NOT NULL,
  `demanda_id` bigint unsigned NOT NULL,
  `revisor_id` bigint unsigned DEFAULT NULL,
  `titulo` varchar(160) NOT NULL,
  `mensaje` varchar(255) NOT NULL,
  `leida` tinyint(1) NOT NULL DEFAULT '0',
  `creado_en` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_notif_usuario` (`usuario_id`,`leida`,`creado_en`),
  KEY `fk_notif_demanda` (`demanda_id`),
  KEY `fk_notif_revisor` (`revisor_id`),
  CONSTRAINT `fk_notif_demanda` FOREIGN KEY (`demanda_id`) REFERENCES `demanda` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_notif_revisor` FOREIGN KEY (`revisor_id`) REFERENCES `usuario` (`id`),
  CONSTRAINT `fk_notif_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notificacion`
--

LOCK TABLES `notificacion` WRITE;
/*!40000 ALTER TABLE `notificacion` DISABLE KEYS */;
INSERT INTO `notificacion` VALUES (2,2,5,3,'Revisor asignado a tu denuncia','ONG Revisor ha tomado tu caso: contaminacion del agua',0,'2025-11-19 05:47:16');
/*!40000 ALTER TABLE `notificacion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rol`
--

DROP TABLE IF EXISTS `rol`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rol` (
  `id` tinyint unsigned NOT NULL AUTO_INCREMENT,
  `nombre` varchar(20) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nombre` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rol`
--

LOCK TABLES `rol` WRITE;
/*!40000 ALTER TABLE `rol` DISABLE KEYS */;
INSERT INTO `rol` VALUES (1,'admin'),(2,'ciudadano'),(3,'revisor');
/*!40000 ALTER TABLE `rol` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tipo_demanda`
--

DROP TABLE IF EXISTS `tipo_demanda`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tipo_demanda` (
  `id` smallint unsigned NOT NULL AUTO_INCREMENT,
  `nombre` varchar(120) NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nombre` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tipo_demanda`
--

LOCK TABLES `tipo_demanda` WRITE;
/*!40000 ALTER TABLE `tipo_demanda` DISABLE KEYS */;
INSERT INTO `tipo_demanda` VALUES (1,'Deforestación','Tala ilegal y pérdida de cobertura boscosa'),(2,'Minería ilegal','Extracción no autorizada de minerales'),(3,'Contaminación de agua','Vertimientos y afectaciones a fuentes hídricas'),(4,'Tráfico de fauna','Captura y comercio ilegal de especies'),(5,'Incendios forestales','Quemas e incendios en áreas naturales');
/*!40000 ALTER TABLE `tipo_demanda` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuario`
--

DROP TABLE IF EXISTS `usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuario` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `rol_id` tinyint unsigned NOT NULL,
  `nombre_completo` varchar(120) NOT NULL,
  `correo` varchar(190) NOT NULL,
  `telefono` varchar(32) DEFAULT NULL,
  `contrasena` varchar(120) NOT NULL,
  `creado_en` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `correo` (`correo`),
  KEY `idx_usuario_rol` (`rol_id`),
  CONSTRAINT `fk_usuario_rol` FOREIGN KEY (`rol_id`) REFERENCES `rol` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuario`
--

LOCK TABLES `usuario` WRITE;
/*!40000 ALTER TABLE `usuario` DISABLE KEYS */;
INSERT INTO `usuario` VALUES (1,1,'Admin Justicia Verde','admin@gmail.com','0000000000','admin123','2025-11-15 02:17:00'),(2,2,'Ciudadano Prueba','ciudadano@gmail.com','3000000000','ciudadano123','2025-11-15 02:17:02'),(3,3,'ONG Revisor','revisor@gmail.com','3100000000','revisor123','2025-11-15 02:17:34'),(4,2,'prueba 2','prueba2@gmail.com',NULL,'12345678','2025-11-19 07:22:03');
/*!40000 ALTER TABLE `usuario` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'justicia_verde'
--

--
-- Dumping routines for database 'justicia_verde'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-11-20 10:33:03

select * from usuario;
