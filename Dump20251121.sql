-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: localhost    Database: justicia_verde
-- ------------------------------------------------------
-- Server version	8.0.43

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
  `ciudadano_id` bigint unsigned NOT NULL,
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
  KEY `idx_demanda_estado` (`estado`),
  KEY `idx_demanda_prioridad` (`prioridad`),
  KEY `idx_demanda_ciudadano` (`ciudadano_id`),
  KEY `idx_demanda_tipo` (`tipo_demanda_id`),
  KEY `idx_demanda_geo` (`latitud`,`longitud`),
  CONSTRAINT `fk_demanda_ciudadano` FOREIGN KEY (`ciudadano_id`) REFERENCES `usuario` (`id`),
  CONSTRAINT `fk_demanda_tipo` FOREIGN KEY (`tipo_demanda_id`) REFERENCES `tipo_demanda` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `demanda`
--

LOCK TABLES `demanda` WRITE;
/*!40000 ALTER TABLE `demanda` DISABLE KEYS */;
INSERT INTO `demanda` VALUES (1,5,'contaminaron rio purace','estan contaminando con desechos el rio purace',3,'medio','tomaron_el_caso',0,'2.440363, -76.604198',2.3824638,-76.4539281,1,'2025-11-15 01:08:57','2025-11-22 01:08:02');
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
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `demanda_revisor`
--

LOCK TABLES `demanda_revisor` WRITE;
/*!40000 ALTER TABLE `demanda_revisor` DISABLE KEYS */;
INSERT INTO `demanda_revisor` VALUES (1,1,3,'2025-11-22 01:08:02');
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
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notificacion`
--

LOCK TABLES `notificacion` WRITE;
/*!40000 ALTER TABLE `notificacion` DISABLE KEYS */;
INSERT INTO `notificacion` VALUES (1,5,1,3,'Revisor asignado a tu denuncia','ONG Revisor ha tomado tu caso: contaminaron rio purace',0,'2025-11-22 01:08:02');
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
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rol`
--

LOCK TABLES `rol` WRITE;
/*!40000 ALTER TABLE `rol` DISABLE KEYS */;
INSERT INTO `rol` VALUES (2,'ciudadano'),(1,'nuevo_nombre'),(4,'nuevo_rol'),(3,'revisor'),(7,'rol_revisor');
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
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuario`
--

LOCK TABLES `usuario` WRITE;
/*!40000 ALTER TABLE `usuario` DISABLE KEYS */;
INSERT INTO `usuario` VALUES (1,1,'Admin Justicia Verde','admin@gmail.com','0000000000','admin123','2025-11-14 01:57:13'),(2,2,'Ciudadano Prueba','ciudadano@gmail.com','3000000000','ciudadano123','2025-11-14 01:57:18'),(3,3,'ONG Revisor','revisor@gmail.com','3100000000','revisor123','2025-11-14 01:57:22'),(5,2,'martha españa','martha@gmail.com',NULL,'11111111','2025-11-14 19:37:46');
/*!40000 ALTER TABLE `usuario` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary view structure for view `vw_conteo_demandas_por_tipo`
--

DROP TABLE IF EXISTS `vw_conteo_demandas_por_tipo`;
/*!50001 DROP VIEW IF EXISTS `vw_conteo_demandas_por_tipo`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `vw_conteo_demandas_por_tipo` AS SELECT 
 1 AS `tipo_demanda`,
 1 AS `total_demandas`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `vw_demanda_detalle_completo`
--

DROP TABLE IF EXISTS `vw_demanda_detalle_completo`;
/*!50001 DROP VIEW IF EXISTS `vw_demanda_detalle_completo`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `vw_demanda_detalle_completo` AS SELECT 
 1 AS `demanda_id`,
 1 AS `titulo`,
 1 AS `descripcion`,
 1 AS `tipo`,
 1 AS `prioridad`,
 1 AS `estado`,
 1 AS `creado_en`,
 1 AS `ciudadano`,
 1 AS `foto`,
 1 AS `revisor`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `vw_demandas_por_revisor`
--

DROP TABLE IF EXISTS `vw_demandas_por_revisor`;
/*!50001 DROP VIEW IF EXISTS `vw_demandas_por_revisor`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `vw_demandas_por_revisor` AS SELECT 
 1 AS `revisor_id`,
 1 AS `revisor`,
 1 AS `demanda_id`,
 1 AS `titulo`,
 1 AS `estado`,
 1 AS `prioridad`,
 1 AS `creado_en`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `vw_demandas_publicas`
--

DROP TABLE IF EXISTS `vw_demandas_publicas`;
/*!50001 DROP VIEW IF EXISTS `vw_demandas_publicas`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `vw_demandas_publicas` AS SELECT 
 1 AS `id`,
 1 AS `titulo`,
 1 AS `descripcion`,
 1 AS `tipo_demanda`,
 1 AS `prioridad`,
 1 AS `estado`,
 1 AS `creado_en`,
 1 AS `ciudadano`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `vw_notificaciones_pendientes`
--

DROP TABLE IF EXISTS `vw_notificaciones_pendientes`;
/*!50001 DROP VIEW IF EXISTS `vw_notificaciones_pendientes`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `vw_notificaciones_pendientes` AS SELECT 
 1 AS `id`,
 1 AS `usuario_id`,
 1 AS `usuario`,
 1 AS `titulo`,
 1 AS `mensaje`,
 1 AS `creado_en`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `vw_usuarios_con_rol`
--

DROP TABLE IF EXISTS `vw_usuarios_con_rol`;
/*!50001 DROP VIEW IF EXISTS `vw_usuarios_con_rol`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `vw_usuarios_con_rol` AS SELECT 
 1 AS `id`,
 1 AS `nombre_completo`,
 1 AS `correo`,
 1 AS `telefono`,
 1 AS `rol`,
 1 AS `creado_en`*/;
SET character_set_client = @saved_cs_client;

--
-- Final view structure for view `vw_conteo_demandas_por_tipo`
--

/*!50001 DROP VIEW IF EXISTS `vw_conteo_demandas_por_tipo`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `vw_conteo_demandas_por_tipo` AS select `td`.`nombre` AS `tipo_demanda`,count(`d`.`id`) AS `total_demandas` from (`tipo_demanda` `td` left join `demanda` `d` on((`td`.`id` = `d`.`tipo_demanda_id`))) group by `td`.`id`,`td`.`nombre` order by `total_demandas` desc */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `vw_demanda_detalle_completo`
--

/*!50001 DROP VIEW IF EXISTS `vw_demanda_detalle_completo`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `vw_demanda_detalle_completo` AS select `d`.`id` AS `demanda_id`,`d`.`titulo` AS `titulo`,`d`.`descripcion` AS `descripcion`,`td`.`nombre` AS `tipo`,`d`.`prioridad` AS `prioridad`,`d`.`estado` AS `estado`,`d`.`creado_en` AS `creado_en`,`u`.`nombre_completo` AS `ciudadano`,`df`.`ruta` AS `foto`,`r`.`nombre_completo` AS `revisor` from (((((`demanda` `d` join `tipo_demanda` `td` on((`d`.`tipo_demanda_id` = `td`.`id`))) join `usuario` `u` on((`d`.`ciudadano_id` = `u`.`id`))) left join `demanda_foto` `df` on((`d`.`id` = `df`.`demanda_id`))) left join `demanda_revisor` `dr` on((`d`.`id` = `dr`.`demanda_id`))) left join `usuario` `r` on((`dr`.`revisor_id` = `r`.`id`))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `vw_demandas_por_revisor`
--

/*!50001 DROP VIEW IF EXISTS `vw_demandas_por_revisor`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `vw_demandas_por_revisor` AS select `dr`.`revisor_id` AS `revisor_id`,`r`.`nombre_completo` AS `revisor`,`d`.`id` AS `demanda_id`,`d`.`titulo` AS `titulo`,`d`.`estado` AS `estado`,`d`.`prioridad` AS `prioridad`,`d`.`creado_en` AS `creado_en` from ((`demanda_revisor` `dr` join `usuario` `r` on((`dr`.`revisor_id` = `r`.`id`))) join `demanda` `d` on((`dr`.`demanda_id` = `d`.`id`))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `vw_demandas_publicas`
--

/*!50001 DROP VIEW IF EXISTS `vw_demandas_publicas`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `vw_demandas_publicas` AS select `d`.`id` AS `id`,`d`.`titulo` AS `titulo`,`d`.`descripcion` AS `descripcion`,`td`.`nombre` AS `tipo_demanda`,`d`.`prioridad` AS `prioridad`,`d`.`estado` AS `estado`,`d`.`creado_en` AS `creado_en`,if((`d`.`anonima` = 1),'ANÓNIMO',`u`.`nombre_completo`) AS `ciudadano` from ((`demanda` `d` join `tipo_demanda` `td` on((`d`.`tipo_demanda_id` = `td`.`id`))) left join `usuario` `u` on((`d`.`ciudadano_id` = `u`.`id`))) where (`d`.`publico` = 1) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `vw_notificaciones_pendientes`
--

/*!50001 DROP VIEW IF EXISTS `vw_notificaciones_pendientes`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `vw_notificaciones_pendientes` AS select `n`.`id` AS `id`,`n`.`usuario_id` AS `usuario_id`,`u`.`nombre_completo` AS `usuario`,`n`.`titulo` AS `titulo`,`n`.`mensaje` AS `mensaje`,`n`.`creado_en` AS `creado_en` from (`notificacion` `n` join `usuario` `u` on((`n`.`usuario_id` = `u`.`id`))) where (`n`.`leida` = 0) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `vw_usuarios_con_rol`
--

/*!50001 DROP VIEW IF EXISTS `vw_usuarios_con_rol`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `vw_usuarios_con_rol` AS select `u`.`id` AS `id`,`u`.`nombre_completo` AS `nombre_completo`,`u`.`correo` AS `correo`,`u`.`telefono` AS `telefono`,`r`.`nombre` AS `rol`,`u`.`creado_en` AS `creado_en` from (`usuario` `u` join `rol` `r` on((`u`.`rol_id` = `r`.`id`))) order by `u`.`id` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-11-21 20:21:50
