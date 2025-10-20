
-- Proyecto: Justicia Verde (Esquema simple y en español, uso local)
-- MySQL 8.0+  |  Codificación: utf8mb4
-- Requisitos cubiertos:
-- - 3 roles: admin, ciudadano, revisor
-- - Registro/Login (contraseña SIN encriptar, sólo para pruebas locales)
-- - Ciudadano: CRUD de demandas + notificaciones cuando un revisor tome el caso
-- - Revisor (ONG): ve demandas y se autoasigna; una demanda puede tener varios revisores
-- - Admin: puede ver todas las demandas
-- - Demanda: título, descripción, tipo (5 principales), prioridad (medio, alta, critica),
--            anonimato, ubicación (texto + lat/lng), evidencias (solo fotos)
-- - Estado de demanda: 'en_revision' | 'tomaron_el_caso'

CREATE DATABASE IF NOT EXISTS justicia_verde
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_0900_ai_ci;
USE justicia_verde;
-- drop database justicia_verde;

CREATE TABLE rol (
  id TINYINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  nombre VARCHAR(20) NOT NULL UNIQUE
) ENGINE=InnoDB;

INSERT IGNORE INTO rol (id, nombre) VALUES
(1,'admin'),
(2,'ciudadano'),
(3,'revisor');

CREATE TABLE usuario (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  rol_id TINYINT UNSIGNED NOT NULL,
  nombre_completo VARCHAR(120) NOT NULL,
  correo VARCHAR(190) NOT NULL UNIQUE,
  telefono VARCHAR(32) NULL,
  contrasena VARCHAR(120) NOT NULL,
  creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_usuario_rol (rol_id),
  CONSTRAINT fk_usuario_rol FOREIGN KEY (rol_id) REFERENCES rol(id)
) ENGINE=InnoDB;

CREATE TABLE tipo_demanda (
  id SMALLINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  nombre VARCHAR(120) NOT NULL UNIQUE,
  descripcion VARCHAR(255) NULL
) ENGINE=InnoDB;

INSERT IGNORE INTO tipo_demanda (id, nombre, descripcion) VALUES
(1,'Deforestación','Tala ilegal y pérdida de cobertura boscosa'),
(2,'Minería ilegal','Extracción no autorizada de minerales'),
(3,'Contaminación de agua','Vertimientos y afectaciones a fuentes hídricas'),
(4,'Tráfico de fauna','Captura y comercio ilegal de especies'),
(5,'Incendios forestales','Quemas e incendios en áreas naturales');

CREATE TABLE demanda (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  ciudadano_id BIGINT UNSIGNED NOT NULL,
  titulo VARCHAR(160) NOT NULL,
  descripcion TEXT NOT NULL,
  tipo_demanda_id SMALLINT UNSIGNED NOT NULL,
  prioridad ENUM('medio','alta','critica') NOT NULL DEFAULT 'medio',
  estado ENUM('en_revision','tomaron_el_caso') NOT NULL DEFAULT 'en_revision',
  anonima BOOLEAN NOT NULL DEFAULT FALSE,
  ubicacion_texto VARCHAR(190) NULL,
  latitud DECIMAL(10,7) NULL,
  longitud DECIMAL(10,7) NULL,
  publico BOOLEAN NOT NULL DEFAULT TRUE,
  creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  actualizado_en TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_demanda_estado (estado),
  INDEX idx_demanda_prioridad (prioridad),
  INDEX idx_demanda_ciudadano (ciudadano_id),
  INDEX idx_demanda_tipo (tipo_demanda_id),
  INDEX idx_demanda_geo (latitud, longitud),
  CONSTRAINT fk_demanda_ciudadano FOREIGN KEY (ciudadano_id) REFERENCES usuario(id),
  CONSTRAINT fk_demanda_tipo FOREIGN KEY (tipo_demanda_id) REFERENCES tipo_demanda(id)
) ENGINE=InnoDB;

CREATE TABLE demanda_foto (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  demanda_id BIGINT UNSIGNED NOT NULL,
  ruta VARCHAR(255) NOT NULL,
  descripcion VARCHAR(255) NULL,
  subido_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_foto_demanda (demanda_id),
  CONSTRAINT fk_foto_demanda FOREIGN KEY (demanda_id) REFERENCES demanda(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE demanda_revisor (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  demanda_id BIGINT UNSIGNED NOT NULL,
  revisor_id BIGINT UNSIGNED NOT NULL,
  asignado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_demanda_revisor (demanda_id, revisor_id),
  INDEX idx_asig_demanda (demanda_id),
  INDEX idx_asig_revisor (revisor_id),
  CONSTRAINT fk_asig_demanda FOREIGN KEY (demanda_id) REFERENCES demanda(id) ON DELETE CASCADE,
  CONSTRAINT fk_asig_revisor FOREIGN KEY (revisor_id) REFERENCES usuario(id)
) ENGINE=InnoDB;

CREATE TABLE notificacion (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  usuario_id BIGINT UNSIGNED NOT NULL,
  demanda_id BIGINT UNSIGNED NOT NULL,
  revisor_id BIGINT UNSIGNED NULL,
  titulo VARCHAR(160) NOT NULL,
  mensaje VARCHAR(255) NOT NULL,
  leida BOOLEAN NOT NULL DEFAULT FALSE,
  creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_notif_usuario (usuario_id, leida, creado_en),
  CONSTRAINT fk_notif_usuario FOREIGN KEY (usuario_id) REFERENCES usuario(id) ON DELETE CASCADE,
  CONSTRAINT fk_notif_demanda FOREIGN KEY (demanda_id) REFERENCES demanda(id) ON DELETE CASCADE,
  CONSTRAINT fk_notif_revisor FOREIGN KEY (revisor_id) REFERENCES usuario(id)
) ENGINE=InnoDB;

INSERT IGNORE INTO usuario (id, rol_id, nombre_completo, correo, telefono, contrasena)
VALUES (1, 1, 'Admin Justicia Verde', 'admin@gmail.com', '0000000000', 'admin123');

INSERT IGNORE INTO usuario (id, rol_id, nombre_completo, correo, telefono, contrasena)
VALUES (2, 2, 'Ciudadano Prueba', 'ciudadano@gmail.com', '3000000000', 'ciudadano123');

INSERT IGNORE INTO usuario (id, rol_id, nombre_completo, correo, telefono, contrasena)
VALUES (3, 3, 'ONG Revisor', 'revisor@gmail.com', '3100000000', 'revisor123');

