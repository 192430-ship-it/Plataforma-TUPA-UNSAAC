# Módulo de Trámites TUPA

## 1. Descripción

El módulo de Trámites forma parte del Sistema de Gestión de Trámites
TUPA-UNSAAC y permite al usuario registrar un procedimiento
administrativo de manera digital.

El proceso integra el catálogo de procedimientos, la validación de
datos, la carga de documentos, el registro del trámite y la generación
de un expediente para su posterior seguimiento.

### Tecnologías

-   **Frontend:** HTML, CSS y JavaScript vanilla.
-   **Backend:** Node.js + Express.
-   **Base de datos:** MySQL.

------------------------------------------------------------------------

## 2. Arquitectura

La solución utiliza un modelo cliente-servidor:

-   **Frontend:** gestiona el wizard, validaciones y envío de
    información.
-   **Backend:** procesa solicitudes, documentos y trámites mediante
    Express.
-   **MySQL:** almacena usuarios, procedimientos, trámites, documentos,
    estados y demás información administrativa.

Estructura principal:

``` text
Proyecto-TUPA-UNSAAC/
├── backend/
│   ├── server.js
│   ├── routes/
│   ├── config/
│   └── uploads/
├── database/
│   └── schema.sql
├── shared/
├── tramites/
├── catalogo/
└── Seguimiento/
```

------------------------------------------------------------------------

## 3. Flujo general

El usuario inicia el proceso desde el catálogo seleccionando un
procedimiento. El sistema redirige al wizard utilizando el código del
trámite:

``` text
tramites.html?procedimiento=T-0042
```

El wizard está compuesto por cuatro pasos:

1.  **Datos del interesado.**
2.  **Selección y confirmación del trámite.**
3.  **Carga de documentos.**
4.  **Confirmación y envío.**

Al finalizar, se genera un número de expediente y el usuario es
redirigido al módulo de Seguimiento.

------------------------------------------------------------------------

## 4. Wizard de trámites

### Paso 1: Datos del interesado

El usuario introduce su DNI y el frontend consulta la API:

``` text
GET /api/usuarios/:documento
```

El backend consulta MySQL y devuelve información como nombres,
apellidos, facultad, correo y teléfono.

Los datos se muestran de forma autocompletada y los errores se presentan
mediante mensajes inline.

### Paso 2: Selección del trámite

El procedimiento seleccionado se muestra junto con:

-   Código y nombre.
-   Costo.
-   Tiempo estimado.
-   Silencio administrativo.
-   Requisitos documentales.

La información se obtiene mediante:

``` text
GET /api/procedimientos/:codigo
```

### Paso 3: Carga de documentos

El usuario puede seleccionar o arrastrar los documentos requeridos. El
sistema valida:

-   Formato permitido.
-   Tamaño máximo.
-   Documentos obligatorios.

Los archivos se envían mediante:

``` text
POST /api/tramites/:id/documentos
```

El backend utiliza `multer` para recibir los archivos y registrar sus
metadatos en MySQL.

### Paso 4: Confirmación y envío

Se muestra un resumen de los datos del usuario, procedimiento y
documentos adjuntos. Después de aceptar la declaración correspondiente,
se realiza:

``` text
POST /api/tramites
```

El backend genera un expediente, por ejemplo:

``` text
EXP-2026-00123
```

Finalmente, el usuario es redirigido al módulo de Seguimiento.

------------------------------------------------------------------------

# 5. Base de datos MySQL

La base de datos se denomina `tupa_unsaac` y utiliza `utf8mb4` para
soportar correctamente caracteres del sistema.

``` sql
CREATE DATABASE IF NOT EXISTS tupa_unsaac
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;
```

El esquema se divide en cuatro grupos principales:

1.  **Catálogos y estructura organizacional.**
2.  **Usuarios y administración.**
3.  **Procedimientos y trámites.**
4.  **Seguimiento, notificaciones y auditoría.**

## 5.1 Catálogos y estructura organizacional

  -----------------------------------------------------------------------
  Tabla                               Descripción
  ----------------------------------- -----------------------------------
  `roles`                             Define los roles de los usuarios
                                      administrativos.

  `facultades`                        Registra las facultades de la
                                      universidad.

  `categorias`                        Clasifica los procedimientos TUPA.

  `oficinas`                          Registra las oficinas responsables
                                      de los trámites.

  `matrices_facultad`                 Almacena información institucional
                                      asociada a las facultades.
  -----------------------------------------------------------------------

Las categorías iniciales incluyen **ACADÉMICOS, GRADOS, MATRÍCULA,
CONSTANCIAS, PAGOS y OTROS**.

## 5.2 Usuarios y administración

  -----------------------------------------------------------------------
  Tabla                               Descripción
  ----------------------------------- -----------------------------------
  `usuarios`                          Almacena los datos personales y
                                      académicos de los usuarios.

  `usuarios_administrativos`          Relaciona usuarios con oficinas y
                                      roles administrativos.
  -----------------------------------------------------------------------

El DNI se utiliza como identificador único para la validación del
usuario.

## 5.3 Procedimientos y trámites

  -----------------------------------------------------------------------
  Tabla                               Descripción
  ----------------------------------- -----------------------------------
  `procedimientos`                    Contiene código, nombre, categoría,
                                      costo, plazo, requisitos y silencio
                                      administrativo.

  `tramites`                          Registra las solicitudes realizadas
                                      y su número de expediente.

  `documentos`                        Registra los archivos asociados a
                                      cada trámite.
  -----------------------------------------------------------------------

Los requisitos de cada procedimiento se almacenan en formato `JSON`. Por
ejemplo:

``` json
[
  {
    "codigo": "dni",
    "nombre": "Copia de DNI",
    "obligatorio": true,
    "formatos": ["pdf", "jpg", "png"],
    "max_mb": 2
  }
]
```

Los trámites manejan los estados:

``` text
registrado
en_revision
observado
aprobado
rechazado
```

## 5.4 Seguimiento y control

  -----------------------------------------------------------------------
  Tabla                               Descripción
  ----------------------------------- -----------------------------------
  `historial_estados`                 Registra los cambios de estado de
                                      cada trámite.

  `observaciones`                     Almacena observaciones realizadas
                                      durante la revisión.

  `derivaciones`                      Registra el traslado de expedientes
                                      entre oficinas.

  `notificaciones`                    Gestiona avisos dirigidos a los
                                      usuarios.

  `actas_institucionales`             Registra actas y documentos
                                      institucionales.

  `logs_sistema`                      Registra acciones realizadas dentro
                                      del sistema para auditoría.
  -----------------------------------------------------------------------

## 5.5 Relaciones principales

Las relaciones centrales del modelo son:

``` text
usuarios
   │
   ├── usuarios_administrativos
   │        ├── roles
   │        └── oficinas
   │
   └── tramites
          ├── procedimientos ─── categorias
          ├── documentos
          ├── historial_estados
          ├── observaciones
          └── derivaciones
```

Además, `notificaciones` se relaciona con usuarios y, opcionalmente, con
trámites.

Las claves foráneas permiten mantener la integridad referencial. En
tablas dependientes como `documentos`, `historial_estados`,
`observaciones` y `derivaciones`, la eliminación de un trámite puede
eliminar sus registros relacionados mediante `ON DELETE CASCADE`.

## 5.6 Índices

Se incluyen índices para mejorar las consultas frecuentes sobre:

-   Número de expediente.
-   Estado del trámite.
-   Documentos asociados.
-   Historial.
-   Observaciones.
-   Derivaciones.
-   Notificaciones por usuario.
-   Logs por usuario.
-   DNI.

------------------------------------------------------------------------

# 6. API REST

  --------------------------------------------------------------------------------
  Método                  Ruta                             Función
  ----------------------- -------------------------------- -----------------------
  `GET`                   `/api/usuarios/:documento`       Validar usuario.

  `GET`                   `/api/procedimientos`            Listar procedimientos.

  `GET`                   `/api/procedimientos/:codigo`    Obtener procedimiento y
                                                           requisitos.

  `POST`                  `/api/tramites`                  Registrar trámite.

  `POST`                  `/api/tramites/:id/documentos`   Subir documentos.

  `GET`                   `/api/tramites/:expediente`      Consultar seguimiento.
  --------------------------------------------------------------------------------

------------------------------------------------------------------------

# 7. Mejoras de UI/UX y accesibilidad

Como parte de la Fase 3 se consideran mejoras orientadas a facilitar el
uso del módulo.

## 7.1 ARIA

Se utilizan atributos ARIA para mejorar la interacción con tecnologías
de asistencia.

El paso activo del wizard utiliza:

``` html
aria-current="step"
```

También se consideran:

-   `aria-describedby` para relacionar campos con mensajes de error.
-   `aria-live` para notificaciones dinámicas.
-   Etiquetas asociadas a los campos de formulario.

## 7.2 Contraste y legibilidad

Los mensajes de error y éxito no dependen únicamente del color. Se
utilizan textos e indicadores visuales para facilitar su identificación.

Se mantiene un contraste adecuado entre textos, botones y fondos.

## 7.3 Diseño responsive

El wizard se adapta a computadoras, tablets y dispositivos móviles.

La carga de documentos permite tanto **drag-and-drop** como selección
mediante un botón, facilitando su uso en dispositivos táctiles.

También se considera navegación mediante teclado y controles con un área
táctil adecuada.

## 7.4 Notificaciones y estados de carga

Los mensajes mediante `alert()` se reemplazan por notificaciones tipo
**toast**.

Se muestran estados de carga durante:

-   Consultas a la API.
-   Carga de documentos.
-   Registro final del trámite.

------------------------------------------------------------------------

# 8. Datos iniciales

El esquema incluye datos de prueba para categorías, usuarios
administrativos y procedimientos TUPA.

Entre los procedimientos registrados se encuentran:

-   `T-0042` --- Expedición de Duplicado de Carné Universitario.
-   `T-0158` --- Otorgamiento de Grado Académico de Bachiller.
-   `T-0012` --- Reserva de Matrícula para Estudiantes de Pregrado.
-   `T-0022` --- Constancia de No Adeudo a la Biblioteca.
-   `T-0034` --- Certificado de Estudios.
-   `T-0076` --- Solicitud de Becas y Créditos Educativos.
-   `T-0051` --- Convalidación de Asignaturas.
-   `T-0163` --- Duplicado de Diploma de Grado.
-   `T-0099` --- Carnet Universitario Digital.
-   `T-0067` --- Solicitud de Traslado Interno.
-   `T-0028` --- Constancia de Egresado.

------------------------------------------------------------------------

# 9. Comandos para ejecución

Para ejecutar el backend desde Windows:

``` powershell
cd "C:\Users\Baruc\OneDrive\Documentos\Proyecto-TUPA-UNSAAC\Proyecto-TUPA-UNSAAC\backend"
npm install
npm run dev
```

El primer comando instala las dependencias del proyecto y `npm run dev`
inicia el servidor en modo desarrollo.

------------------------------------------------------------------------

# 10. Usuarios de administración

Para realizar pruebas del módulo administrativo se dispone de los
siguientes usuarios:

  Campo          Valor
  -------------- --------------
  **Username**   `jquispe`
  **Password**   `Admin2026!`

Estas credenciales corresponden al usuario administrativo de prueba
registrado en la base de datos.

------------------------------------------------------------------------

# 11. Resultado esperado

La implementación integra el proceso completo:

**Catálogo → Datos del interesado → Trámite → Documentos → Confirmación
→ Expediente → Seguimiento**

De esta manera, el módulo permite integrar el registro del usuario, los
procedimientos TUPA, la gestión documental, el seguimiento de
expedientes y las funciones administrativas necesarias para procesar los
trámites.
