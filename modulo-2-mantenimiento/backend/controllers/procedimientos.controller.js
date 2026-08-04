const db = require("../config/db");

// ==========================================
// LISTAR PROCEDIMIENTOS
// GET /api/procedimientos
// ==========================================
const listarProcedimientos = (req, res) => {

    const sql = `
        SELECT
            p.id,
            p.codigo,
            p.nombre,
            p.descripcion,
            p.costo,
            p.plazo_atencion,
            p.estado,
            c.nombre AS categoria,
            o.nombre AS oficina
        FROM procedimientos p
        INNER JOIN categorias c
            ON p.categoria_id = c.id
        INNER JOIN oficinas o
            ON p.oficina_id = o.id
        ORDER BY p.id DESC
    `;

    db.query(sql, (err, resultados) => {

        if (err) {
            console.error("Error:", err);

            return res.status(500).json({
                mensaje: "Error al consultar los procedimientos",
                error: err.message
            });
        }

        res.json(resultados);
    });
};


// ==========================================
// OBTENER PROCEDIMIENTO POR ID
// GET /api/procedimientos/:id
// ==========================================
const obtenerProcedimiento = (req, res) => {

    const { id } = req.params;

    const sql = `
        SELECT
            p.id,
            p.codigo,
            p.nombre,
            p.descripcion,
            p.costo,
            p.plazo_atencion,
            p.estado,
            c.nombre AS categoria,
            o.nombre AS oficina
        FROM procedimientos p
        INNER JOIN categorias c
            ON p.categoria_id = c.id
        INNER JOIN oficinas o
            ON p.oficina_id = o.id
        WHERE p.id = ?
    `;

    db.query(sql, [id], (err, resultados) => {

        if (err) {
            return res.status(500).json({
                mensaje: "Error al consultar el procedimiento",
                error: err.message
            });
        }

        if (resultados.length === 0) {
            return res.status(404).json({
                mensaje: "Procedimiento no encontrado"
            });
        }

        res.json(resultados[0]);
    });
};


// ==========================================
// CREAR PROCEDIMIENTO
// POST /api/procedimientos
// ==========================================
const crearProcedimiento = (req, res) => {

    const {
        codigo,
        nombre,
        descripcion,
        costo,
        plazo_atencion,
        categoria_id,
        oficina_id
    } = req.body;

    // Validaciones
    if (!codigo || !nombre || costo === undefined ||
        !plazo_atencion || !categoria_id || !oficina_id) {

        return res.status(400).json({
            mensaje: "Todos los campos obligatorios deben ser enviados"
        });
    }

    if (costo < 0) {

        return res.status(400).json({
            mensaje: "El costo no puede ser negativo"
        });
    }

    if (plazo_atencion <= 0) {

        return res.status(400).json({
            mensaje: "El plazo de atención debe ser mayor a 0"
        });
    }

    const sql = `
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
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    const valores = [
        codigo,
        nombre,
        descripcion || null,
        costo,
        plazo_atencion,
        categoria_id,
        oficina_id
    ];

    db.query(sql, valores, (err, resultado) => {

        if (err) {

            if (err.code === "ER_DUP_ENTRY") {
                return res.status(409).json({
                    mensaje: "El código del procedimiento ya existe"
                });
            }

            return res.status(500).json({
                mensaje: "Error al registrar el procedimiento",
                error: err.message
            });
        }

        res.status(201).json({
            mensaje: "Procedimiento registrado correctamente",
            id: resultado.insertId
        });
    });
};


// ==========================================
// ACTUALIZAR PROCEDIMIENTO
// PUT /api/procedimientos/:id
// ==========================================
const actualizarProcedimiento = (req, res) => {

    const { id } = req.params;

    const {
        codigo,
        nombre,
        descripcion,
        costo,
        plazo_atencion,
        categoria_id,
        oficina_id,
        estado
    } = req.body;

    if (!codigo || !nombre || costo === undefined ||
        !plazo_atencion || !categoria_id || !oficina_id ||
        estado === undefined) {

        return res.status(400).json({
            mensaje: "Todos los campos obligatorios deben ser enviados"
        });
    }

    const sql = `
        UPDATE procedimientos
        SET
            codigo = ?,
            nombre = ?,
            descripcion = ?,
            costo = ?,
            plazo_atencion = ?,
            categoria_id = ?,
            oficina_id = ?,
            estado = ?
        WHERE id = ?
    `;

    const valores = [
        codigo,
        nombre,
        descripcion || null,
        costo,
        plazo_atencion,
        categoria_id,
        oficina_id,
        estado,
        id
    ];

    db.query(sql, valores, (err, resultado) => {

        if (err) {

            if (err.code === "ER_DUP_ENTRY") {
                return res.status(409).json({
                    mensaje: "El código del procedimiento ya existe"
                });
            }

            return res.status(500).json({
                mensaje: "Error al actualizar el procedimiento",
                error: err.message
            });
        }

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                mensaje: "Procedimiento no encontrado"
            });
        }

        res.json({
            mensaje: "Procedimiento actualizado correctamente"
        });
    });
};


// ==========================================
// ELIMINAR / DESACTIVAR PROCEDIMIENTO
// DELETE /api/procedimientos/:id
// ==========================================
const eliminarProcedimiento = (req, res) => {

    const { id } = req.params;

    const sql = `
        UPDATE procedimientos
        SET estado = FALSE
        WHERE id = ?
    `;

    db.query(sql, [id], (err, resultado) => {

        if (err) {
            return res.status(500).json({
                mensaje: "Error al desactivar el procedimiento",
                error: err.message
            });
        }

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                mensaje: "Procedimiento no encontrado"
            });
        }

        res.json({
            mensaje: "Procedimiento desactivado correctamente"
        });
    });
};


module.exports = {
    listarProcedimientos,
    obtenerProcedimiento,
    crearProcedimiento,
    actualizarProcedimiento,
    eliminarProcedimiento
};