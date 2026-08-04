USE tupa_unsaac;

-- ---------------------------------------------------------------------
-- Categorías (antes eran texto libre en procedimientos.categoria /
-- categoria_nombre; ahora procedimientos referencia categorias.id_categoria)
-- ---------------------------------------------------------------------
INSERT INTO categorias (nombre, sigla, descripcion) VALUES
('ACADÉMICOS', 'academicos', 'Trámites relacionados a la vida académica del estudiante'),
('GRADOS', 'grados', 'Trámites de obtención y duplicado de grados y títulos'),
('MATRÍCULA', 'matricula', 'Trámites de matrícula, reserva y traslados'),
('CONSTANCIAS', 'constancias', 'Emisión de constancias y certificados'),
('PAGOS', 'pagos', 'Becas, créditos educativos y trámites de pago'),
('OTROS', 'otros', 'Otros trámites administrativos');


-- ---------------------------------------------------------------------
-- Datos de ejemplo para administración
-- ---------------------------------------------------------------------
-- Credenciales administrativas de prueba:
--   Usuario: jquispe   Contraseña: Admin2026!
--   Usuario: mmamani   Contraseña: Tupa#2026

INSERT INTO roles (id_rol, nombre, descripcion) VALUES
  (1, 'Administrador TUPA', 'Administrador del sistema TUPA UNSAAC'),
  (2, 'Operador de Trámites', 'Encargado de procesar trámites y expedientes')
ON DUPLICATE KEY UPDATE
  nombre = VALUES(nombre),
  descripcion = VALUES(descripcion);

INSERT INTO oficinas (id_oficina, nombre, sigla, id_facultad, descripcion, activo) VALUES
  (1, 'Dirección de Modernización', 'DIMOD', NULL, 'Oficina central de modernización institucional', 1),
  (2, 'Mesa de Partes Virtual', 'MPV', NULL, 'Oficina de recepción y gestión de trámites digitales', 1)
ON DUPLICATE KEY UPDATE
  nombre = VALUES(nombre),
  sigla = VALUES(sigla),
  id_facultad = VALUES(id_facultad),
  descripcion = VALUES(descripcion),
  activo = VALUES(activo);

INSERT INTO usuarios (id_usuario, id_persona, codigo_usuario, dni, nombres, apellidos, correo_institucional, email, telefono, facultad, escuela, estado) VALUES
  (1, 'P-0001', 'ADM001', '00000001', 'Javier', 'Quispe', 'jquispe@unsaac.edu.pe', 'jquispe@unsaac.edu.pe', '984001001', 'Dirección de Modernización', 'Administración', 'activo'),
  (2, 'P-0002', 'ADM002', '00000002', 'María', 'Mamani', 'mmamani@unsaac.edu.pe', 'mmamani@unsaac.edu.pe', '984002002', 'Dirección de Modernización', 'Administración', 'activo')
ON DUPLICATE KEY UPDATE
  id_persona = VALUES(id_persona),
  codigo_usuario = VALUES(codigo_usuario),
  dni = VALUES(dni),
  nombres = VALUES(nombres),
  apellidos = VALUES(apellidos),
  correo_institucional = VALUES(correo_institucional),
  email = VALUES(email),
  telefono = VALUES(telefono),
  facultad = VALUES(facultad),
  escuela = VALUES(escuela),
  estado = VALUES(estado);

INSERT INTO usuarios_administrativos (id_admin, id_usuario, id_oficina, id_rol, username, password_hash, nombres, apellidos, email, activo) VALUES
  (1, 1, 1, 1, 'jquispe', '$2a$10$dPbex6YgsQXdvoj2A4wh5eqa5CxxRL1H0ABWuQtRbH5sq7XYJFoZa', 'Javier', 'Quispe', 'jquispe@unsaac.edu.pe', 1),
  (2, 2, 2, 1, 'mmamani', '$2a$10$SQYLm9/e1V7cBWg1C511oO2mXrv3SJDWRoZdCD8v9MyCD1TCIqmZe', 'María', 'Mamani', 'mmamani@unsaac.edu.pe', 1)
ON DUPLICATE KEY UPDATE
  id_usuario = VALUES(id_usuario),
  id_oficina = VALUES(id_oficina),
  id_rol = VALUES(id_rol),
  password_hash = VALUES(password_hash),
  nombres = VALUES(nombres),
  apellidos = VALUES(apellidos),
  email = VALUES(email),
  activo = VALUES(activo);


-- ---------------------------------------------------------------------
-- Usuarios (el nuevo esquema separa nombres/apellidos, usa "dni" en vez
-- de "documento", "correo_institucional"/"email" en vez de "correo", y
-- ya no tiene columna "tipo")
-- ---------------------------------------------------------------------
INSERT INTO usuarios (dni, nombres, apellidos, correo_institucional, email, telefono, facultad, estado) VALUES
('12345678', 'MARIA FERNANDA', 'QUISPE MAMANI', 'maria.quispe@unsaac.edu.pe', 'maria.quispe@unsaac.edu.pe', '987654321', 'FACULTAD DE INGENIERÍA ELÉCTRICA, ELECTRÓNICA, INFORMÁTICA Y MECÁNICA', 'activo'),
('87654321', 'JUAN CARLOS', 'PEREZ GONZALES', 'juan.perez@unsaac.edu.pe', 'juan.perez@unsaac.edu.pe', '912345678', 'FACULTAD DE CIENCIAS CONTABLES Y FINANCIERAS', 'activo'),
('20241234', 'ANA LUCIA', 'HUAMAN CCORIHUAMAN', 'ana.huaman@unsaac.edu.pe', 'ana.huaman@unsaac.edu.pe', '956789012', 'FACULTAD DE CIENCIAS DE LA SALUD', 'activo');

-- ---------------------------------------------------------------------
-- Procedimientos (costo ahora es DECIMAL, plazo ahora es INT en días,
-- silencio_administrativo ahora es ENUM, y categoria/categoria_nombre
-- se reemplazan por id_categoria vía subconsulta a categorias.sigla)
-- ---------------------------------------------------------------------
INSERT INTO procedimientos (id_categoria, codigo, nombre, costo, plazo_dias, silencio_administrativo, estado, requisitos) VALUES

((SELECT id_categoria FROM categorias WHERE sigla = 'academicos'),
 'T-0042', 'Expedición de Duplicado de Carné Universitario', 35.00, 5, 'positivo', 'activo',
 '[{"codigo":"dni","nombre":"Copia de DNI","obligatorio":true,"formatos":["pdf","jpg","png"],"max_mb":2},{"codigo":"foto","nombre":"Fotografía actualizada","obligatorio":true,"formatos":["jpg","png"],"max_mb":2},{"codigo":"voucher","nombre":"Voucher de pago","obligatorio":true,"formatos":["pdf"],"max_mb":5}]'),

((SELECT id_categoria FROM categorias WHERE sigla = 'grados'),
 'T-0158', 'Otorgamiento de Grado Académico de Bachiller', 450.00, 30, 'negativo', 'activo',
 '[{"codigo":"dni","nombre":"Copia de DNI","obligatorio":true,"formatos":["pdf","jpg","png"],"max_mb":2},{"codigo":"record","nombre":"Record académico","obligatorio":true,"formatos":["pdf"],"max_mb":10},{"codigo":"voucher","nombre":"Voucher de pago","obligatorio":true,"formatos":["pdf"],"max_mb":5},{"codigo":"foto","nombre":"Fotografía actualizada","obligatorio":true,"formatos":["jpg","png"],"max_mb":2}]'),

((SELECT id_categoria FROM categorias WHERE sigla = 'matricula'),
 'T-0012', 'Reserva de Matrícula para Estudiantes de Pregrado', 0.00, 2, 'automatico', 'activo',
 '[{"codigo":"dni","nombre":"Copia de DNI","obligatorio":true,"formatos":["pdf","jpg","png"],"max_mb":2},{"codigo":"solicitud","nombre":"Formulario de solicitud","obligatorio":true,"formatos":["pdf"],"max_mb":5}]'),

((SELECT id_categoria FROM categorias WHERE sigla = 'constancias'),
 'T-0022', 'Constancia de No Adeudo a la Biblioteca', 5.00, 0, 'automatico', 'activo',
 '[{"codigo":"dni","nombre":"Copia de DNI","obligatorio":true,"formatos":["pdf","jpg","png"],"max_mb":2},{"codigo":"voucher","nombre":"Voucher de pago","obligatorio":true,"formatos":["pdf"],"max_mb":5}]'),

((SELECT id_categoria FROM categorias WHERE sigla = 'academicos'),
 'T-0089', 'Traslado Externo Nacional o Internacional', 280.00, 15, 'positivo', 'activo',
 '[{"codigo":"dni","nombre":"Copia de DNI","obligatorio":true,"formatos":["pdf","jpg","png"],"max_mb":2},{"codigo":"record","nombre":"Record académico","obligatorio":true,"formatos":["pdf"],"max_mb":10},{"codigo":"voucher","nombre":"Voucher de pago","obligatorio":true,"formatos":["pdf"],"max_mb":5}]'),

((SELECT id_categoria FROM categorias WHERE sigla = 'constancias'),
 'T-0034', 'Certificado de Estudios', 15.00, 3, 'positivo', 'activo',
 '[{"codigo":"dni","nombre":"Copia de DNI","obligatorio":true,"formatos":["pdf","jpg","png"],"max_mb":2},{"codigo":"voucher","nombre":"Voucher de pago","obligatorio":true,"formatos":["pdf"],"max_mb":5}]'),

((SELECT id_categoria FROM categorias WHERE sigla = 'pagos'),
 'T-0076', 'Solicitud de Becas y Créditos Educativos', 0.00, 15, 'negativo', 'activo',
 '[{"codigo":"dni","nombre":"Copia de DNI","obligatorio":true,"formatos":["pdf","jpg","png"],"max_mb":2},{"codigo":"solicitud","nombre":"Formulario de solicitud","obligatorio":true,"formatos":["pdf"],"max_mb":5}]'),

((SELECT id_categoria FROM categorias WHERE sigla = 'academicos'),
 'T-0051', 'Convalidación de Asignaturas', 120.00, 10, 'positivo', 'activo',
 '[{"codigo":"dni","nombre":"Copia de DNI","obligatorio":true,"formatos":["pdf","jpg","png"],"max_mb":2},{"codigo":"silabus","nombre":"Sílabos de asignaturas","obligatorio":true,"formatos":["pdf"],"max_mb":10},{"codigo":"voucher","nombre":"Voucher de pago","obligatorio":true,"formatos":["pdf"],"max_mb":5}]'),

((SELECT id_categoria FROM categorias WHERE sigla = 'grados'),
 'T-0163', 'Duplicado de Diploma de Grado', 180.00, 20, 'negativo', 'activo',
 '[{"codigo":"dni","nombre":"Copia de DNI","obligatorio":true,"formatos":["pdf","jpg","png"],"max_mb":2},{"codigo":"voucher","nombre":"Voucher de pago","obligatorio":true,"formatos":["pdf"],"max_mb":5}]'),

((SELECT id_categoria FROM categorias WHERE sigla = 'otros'),
 'T-0099', 'Carnet Universitario Digital', 0.00, 1, 'automatico', 'activo',
 '[{"codigo":"dni","nombre":"Copia de DNI","obligatorio":true,"formatos":["pdf","jpg","png"],"max_mb":2},{"codigo":"foto","nombre":"Fotografía digital","obligatorio":true,"formatos":["jpg","png"],"max_mb":2}]'),

((SELECT id_categoria FROM categorias WHERE sigla = 'matricula'),
 'T-0067', 'Solicitud de Traslado Interno', 95.00, 10, 'positivo', 'activo',
 '[{"codigo":"dni","nombre":"Copia de DNI","obligatorio":true,"formatos":["pdf","jpg","png"],"max_mb":2},{"codigo":"solicitud","nombre":"Formulario de solicitud","obligatorio":true,"formatos":["pdf"],"max_mb":5},{"codigo":"voucher","nombre":"Voucher de pago","obligatorio":true,"formatos":["pdf"],"max_mb":5}]'),

((SELECT id_categoria FROM categorias WHERE sigla = 'constancias'),
 'T-0028', 'Constancia de Egresado', 25.00, 2, 'automatico', 'activo',
 '[{"codigo":"dni","nombre":"Copia de DNI","obligatorio":true,"formatos":["pdf","jpg","png"],"max_mb":2},{"codigo":"voucher","nombre":"Voucher de pago","obligatorio":true,"formatos":["pdf"],"max_mb":5}]');