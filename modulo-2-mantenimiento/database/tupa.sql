-- =========================================================
-- BASE DE DATOS
-- Plataforma Web para la Gestión del TUPA - UNSAAC
-- Módulo 2: Mantenimiento
-- =========================================================

DROP DATABASE IF EXISTS tupa_unsaac;

CREATE DATABASE tupa_unsaac
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE tupa_unsaac;


-- =========================================================
-- 1. TABLA: oficinas
-- =========================================================

CREATE TABLE oficinas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    descripcion VARCHAR(255),
    estado BOOLEAN NOT NULL DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- =========================================================
-- 2. TABLA: categorias
-- =========================================================

CREATE TABLE categorias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion VARCHAR(255),
    estado BOOLEAN NOT NULL DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- =========================================================
-- 3. TABLA: procedimientos
-- =========================================================

CREATE TABLE procedimientos (
    id INT AUTO_INCREMENT PRIMARY KEY,

    codigo VARCHAR(20) NOT NULL UNIQUE,

    nombre VARCHAR(200) NOT NULL,

    descripcion TEXT,

    costo DECIMAL(10,2) NOT NULL DEFAULT 0.00,

    plazo_atencion INT NOT NULL DEFAULT 1,

    categoria_id INT NOT NULL,

    oficina_id INT NOT NULL,

    estado BOOLEAN NOT NULL DEFAULT TRUE,

    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_procedimiento_categoria
        FOREIGN KEY (categoria_id)
        REFERENCES categorias(id),

    CONSTRAINT fk_procedimiento_oficina
        FOREIGN KEY (oficina_id)
        REFERENCES oficinas(id)
);


-- =========================================================
-- 4. TABLA: requisitos
-- =========================================================

CREATE TABLE requisitos (
    id INT AUTO_INCREMENT PRIMARY KEY,

    nombre VARCHAR(200) NOT NULL UNIQUE,

    descripcion VARCHAR(255),

    obligatorio BOOLEAN NOT NULL DEFAULT TRUE,

    estado BOOLEAN NOT NULL DEFAULT TRUE,

    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- =========================================================
-- 5. TABLA: procedimiento_requisito
-- Relación muchos a muchos
-- =========================================================

CREATE TABLE procedimiento_requisito (
    id INT AUTO_INCREMENT PRIMARY KEY,

    procedimiento_id INT NOT NULL,

    requisito_id INT NOT NULL,

    CONSTRAINT fk_pr_procedimiento
        FOREIGN KEY (procedimiento_id)
        REFERENCES procedimientos(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_pr_requisito
        FOREIGN KEY (requisito_id)
        REFERENCES requisitos(id)
        ON DELETE CASCADE,

    CONSTRAINT uq_procedimiento_requisito
        UNIQUE (procedimiento_id, requisito_id)
);


-- =========================================================
-- ÍNDICES
-- Para optimización de consultas
-- =========================================================

CREATE INDEX idx_procedimientos_nombre
ON procedimientos(nombre);

CREATE INDEX idx_procedimientos_categoria
ON procedimientos(categoria_id);

CREATE INDEX idx_procedimientos_oficina
ON procedimientos(oficina_id);

CREATE INDEX idx_requisitos_nombre
ON requisitos(nombre);


-- =========================================================
-- DATOS INICIALES: OFICINAS
-- =========================================================

INSERT INTO oficinas (nombre, descripcion)
VALUES
(
    'Oficina de Registros Académicos',
    'Oficina encargada de los registros y documentos académicos.'
),
(
    'Secretaría Académica',
    'Oficina encargada de la gestión académica.'
),
(
    'Mesa de Partes',
    'Oficina encargada de recibir y derivar documentos.'
),
(
    'Unidad de Tesorería',
    'Oficina encargada de pagos y asuntos económicos.'
);


-- =========================================================
-- DATOS INICIALES: CATEGORÍAS
-- =========================================================

INSERT INTO categorias (nombre, descripcion)
VALUES
(
    'Académico',
    'Procedimientos relacionados con actividades académicas.'
),
(
    'Administrativo',
    'Procedimientos administrativos generales.'
),
(
    'Documentario',
    'Procedimientos relacionados con documentos y certificados.'
),
(
    'Económico',
    'Procedimientos relacionados con pagos y asuntos económicos.'
);


-- =========================================================
-- DATOS INICIALES: REQUISITOS
-- =========================================================

INSERT INTO requisitos
(nombre, descripcion, obligatorio)
VALUES
(
    'Copia de DNI',
    'Copia simple del documento nacional de identidad.',
    TRUE
),
(
    'Solicitud dirigida a la oficina correspondiente',
    'Solicitud formal del estudiante.',
    TRUE
),
(
    'Recibo de pago',
    'Comprobante correspondiente al pago del trámite.',
    TRUE
),
(
    'Fotografía tamaño carnet',
    'Fotografía reciente del solicitante.',
    FALSE
),
(
    'Certificado de estudios',
    'Documento que acredita los estudios realizados.',
    FALSE
);


-- =========================================================
-- DATOS INICIALES: PROCEDIMIENTOS
-- =========================================================

INSERT INTO procedimientos
(
    codigo,
    nombre,
    descripcion,
    costo,
    plazo_atencion,
    categoria_id,
    oficina_id
)
VALUES
(
    'TUPA-001',
    'Constancia de estudios',
    'Documento que acredita que el estudiante se encuentra realizando estudios.',
    15.00,
    3,
    1,
    1
),
(
    'TUPA-002',
    'Certificado de estudios',
    'Documento que acredita los estudios realizados por el estudiante.',
    20.00,
    5,
    3,
    1
),
(
    'TUPA-003',
    'Solicitud de documentos académicos',
    'Solicitud de documentos relacionados con la situación académica.',
    10.00,
    3,
    1,
    2
),
(
    'TUPA-004',
    'Presentación de solicitud administrativa',
    'Registro y recepción de solicitudes administrativas.',
    0.00,
    2,
    2,
    3
);


-- =========================================================
-- RELACIÓN PROCEDIMIENTOS - REQUISITOS
-- =========================================================

-- Constancia de estudios
INSERT INTO procedimiento_requisito
(procedimiento_id, requisito_id)
VALUES
(1, 1),
(1, 2);


-- Certificado de estudios
INSERT INTO procedimiento_requisito
(procedimiento_id, requisito_id)
VALUES
(2, 1),
(2, 2),
(2, 3);


-- Solicitud de documentos académicos
INSERT INTO procedimiento_requisito
(procedimiento_id, requisito_id)
VALUES
(3, 1),
(3, 2);


-- Presentación de solicitud administrativa
INSERT INTO procedimiento_requisito
(procedimiento_id, requisito_id)
VALUES
(4, 1),
(4, 2);


-- =========================================================
-- CONSULTAS DE VERIFICACIÓN
-- =========================================================

SELECT * FROM oficinas;

SELECT * FROM categorias;

SELECT * FROM procedimientos;

SELECT * FROM requisitos;

SELECT * FROM procedimiento_requisito;