-- =====================================================================
-- TUPA UNSAAC - Esquema de base de datos actualizado según diagrama ER
-- =====================================================================
CREATE DATABASE IF NOT EXISTS tupa_unsaac CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE tupa_unsaac;

-- ---------------------------------------------------------------------
-- Catálogos base
-- ---------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS roles (
  id_rol INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(80) NOT NULL,
  descripcion TEXT,
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS facultades (
  id_facultad INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(200) NOT NULL,
  sigla VARCHAR(20),
  descripcion TEXT,
  activo TINYINT(1) DEFAULT 1
);

CREATE TABLE IF NOT EXISTS categorias (
  id_categoria INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(150) NOT NULL,
  sigla VARCHAR(20),
  descripcion TEXT,
  icono VARCHAR(80),
  activo TINYINT(1) DEFAULT 1
);

-- ---------------------------------------------------------------------
-- Usuarios y estructura organizacional
-- ---------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS usuarios (
  id_usuario INT AUTO_INCREMENT PRIMARY KEY,
  id_persona VARCHAR(30),
  codigo_usuario VARCHAR(20),
  dni VARCHAR(15) NOT NULL UNIQUE,
  nombres VARCHAR(150) NOT NULL,
  apellidos VARCHAR(150) NOT NULL,
  correo_institucional VARCHAR(150),
  email VARCHAR(150),
  telefono VARCHAR(20),
  facultad VARCHAR(150),
  escuela VARCHAR(150),
  fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  estado VARCHAR(20) DEFAULT 'activo'
);

CREATE TABLE IF NOT EXISTS oficinas (
  id_oficina INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(200) NOT NULL,
  sigla VARCHAR(30),
  id_facultad INT,
  descripcion TEXT,
  activo TINYINT(1) DEFAULT 1,
  FOREIGN KEY (id_facultad) REFERENCES facultades(id_facultad)
);

CREATE TABLE IF NOT EXISTS matrices_facultad (
  id_matriz INT AUTO_INCREMENT PRIMARY KEY,
  id_facultad INT NOT NULL,
  anio INT NOT NULL,
  meta_institucional VARCHAR(255),
  indicador VARCHAR(255),
  activo TINYINT(1) DEFAULT 1,
  FOREIGN KEY (id_facultad) REFERENCES facultades(id_facultad)
);

CREATE TABLE IF NOT EXISTS usuarios_administrativos (
  id_admin INT AUTO_INCREMENT PRIMARY KEY,
  id_usuario INT NOT NULL,
  id_oficina INT NOT NULL,
  id_rol INT NOT NULL,
  username VARCHAR(80) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  nombres VARCHAR(150),
  apellidos VARCHAR(150),
  email VARCHAR(150),
  activo TINYINT(1) DEFAULT 1,
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario),
  FOREIGN KEY (id_oficina) REFERENCES oficinas(id_oficina),
  FOREIGN KEY (id_rol) REFERENCES roles(id_rol)
);


-- ---------------------------------------------------------------------
-- Procedimientos y trámites
-- ---------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS procedimientos (
  id_procedimiento INT AUTO_INCREMENT PRIMARY KEY,
  id_categoria INT NOT NULL,
  codigo VARCHAR(20) NOT NULL UNIQUE,
  nombre VARCHAR(300) NOT NULL,
  descripcion TEXT,
  requisitos JSON NOT NULL,
  base_legal TEXT,
  costo DECIMAL(10,2) DEFAULT 0,
  plazo_dias INT DEFAULT 0,
  silencio_administrativo ENUM('positivo','negativo','automatico') DEFAULT 'positivo',
  estado VARCHAR(20) DEFAULT 'activo',
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (id_categoria) REFERENCES categorias(id_categoria)
);

CREATE TABLE IF NOT EXISTS tramites (
  id_tramite INT AUTO_INCREMENT PRIMARY KEY,
  numero_expediente VARCHAR(30) NOT NULL UNIQUE,
  id_usuario INT NOT NULL,
  id_procedimiento INT NOT NULL,
  id_oficina_actual INT,
  estado ENUM('registrado','en_revision','observado','aprobado','rechazado') NOT NULL DEFAULT 'registrado',
  fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario),
  FOREIGN KEY (id_procedimiento) REFERENCES procedimientos(id_procedimiento),
  FOREIGN KEY (id_oficina_actual) REFERENCES oficinas(id_oficina)
);

CREATE TABLE IF NOT EXISTS documentos (
  id_documento INT AUTO_INCREMENT PRIMARY KEY,
  id_tramite INT NOT NULL,
  id_usuario_subio INT,
  nombre_archivo VARCHAR(255) NOT NULL,
  tipo_archivo VARCHAR(100) NOT NULL,
  ruta_archivo VARCHAR(500) NOT NULL,
  tamano_bytes INT NOT NULL,
  requisito_codigo VARCHAR(50),
  fecha_subida TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_tramite) REFERENCES tramites(id_tramite) ON DELETE CASCADE,
  FOREIGN KEY (id_usuario_subio) REFERENCES usuarios(id_usuario)
);

CREATE TABLE IF NOT EXISTS historial_estados (
  id_historial INT AUTO_INCREMENT PRIMARY KEY,
  id_tramite INT NOT NULL,
  estado_anterior VARCHAR(30),
  estado_nuevo VARCHAR(30) NOT NULL,
  id_usuario INT,
  comentario TEXT,
  fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_tramite) REFERENCES tramites(id_tramite) ON DELETE CASCADE,
  FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
);

CREATE TABLE IF NOT EXISTS observaciones (
  id_observacion INT AUTO_INCREMENT PRIMARY KEY,
  id_tramite INT NOT NULL,
  id_usuario INT NOT NULL,
  observacion TEXT NOT NULL,
  estado VARCHAR(20) DEFAULT 'pendiente',
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  fecha_resolucion TIMESTAMP NULL,
  resuelto TINYINT(1) DEFAULT 0,
  comentario_resolucion TEXT,
  FOREIGN KEY (id_tramite) REFERENCES tramites(id_tramite) ON DELETE CASCADE,
  FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
);

CREATE TABLE IF NOT EXISTS derivaciones (
  id_derivacion INT AUTO_INCREMENT PRIMARY KEY,
  id_tramite INT NOT NULL,
  id_oficina_origen INT NOT NULL,
  id_oficina_destino INT NOT NULL,
  id_usuario_deriva INT,
  motivo TEXT,
  estado VARCHAR(20) DEFAULT 'pendiente',
  fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_tramite) REFERENCES tramites(id_tramite) ON DELETE CASCADE,
  FOREIGN KEY (id_oficina_origen) REFERENCES oficinas(id_oficina),
  FOREIGN KEY (id_oficina_destino) REFERENCES oficinas(id_oficina),
  FOREIGN KEY (id_usuario_deriva) REFERENCES usuarios(id_usuario)
);

-- ---------------------------------------------------------------------
-- Notificaciones, actas y auditoría
-- ---------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS notificaciones (
  id_notificacion INT AUTO_INCREMENT PRIMARY KEY,
  id_usuario INT NOT NULL,
  id_tramite INT,
  titulo VARCHAR(200) NOT NULL,
  mensaje TEXT NOT NULL,
  tipo VARCHAR(50) DEFAULT 'info',
  leida TINYINT(1) DEFAULT 0,
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  fecha_lectura TIMESTAMP NULL,
  FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario),
  FOREIGN KEY (id_tramite) REFERENCES tramites(id_tramite) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS actas_institucionales (
  id_acta INT AUTO_INCREMENT PRIMARY KEY,
  tipo VARCHAR(80) NOT NULL,
  numero VARCHAR(50) NOT NULL,
  asunto VARCHAR(255),
  fecha_emision DATE,
  archivo_url VARCHAR(500),
  fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  estado VARCHAR(20) DEFAULT 'vigente'
);

CREATE TABLE IF NOT EXISTS logs_sistema (
  id_log INT AUTO_INCREMENT PRIMARY KEY,
  id_usuario INT,
  accion VARCHAR(100) NOT NULL,
  tabla_afectada VARCHAR(60),
  id_registro_afectado INT,
  ip_origen VARCHAR(45),
  navegador VARCHAR(255),
  fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
);

-- ---------------------------------------------------------------------
-- Índices
-- ---------------------------------------------------------------------

CREATE INDEX idx_tramites_expediente ON tramites(numero_expediente);
CREATE INDEX idx_tramites_estado ON tramites(estado);
CREATE INDEX idx_documentos_tramite ON documentos(id_tramite);
CREATE INDEX idx_historial_tramite ON historial_estados(id_tramite);
CREATE INDEX idx_observaciones_tramite ON observaciones(id_tramite);
CREATE INDEX idx_derivaciones_tramite ON derivaciones(id_tramite);
CREATE INDEX idx_notificaciones_usuario ON notificaciones(id_usuario);
CREATE INDEX idx_logs_usuario ON logs_sistema(id_usuario);
CREATE INDEX idx_usuarios_dni ON usuarios(dni);