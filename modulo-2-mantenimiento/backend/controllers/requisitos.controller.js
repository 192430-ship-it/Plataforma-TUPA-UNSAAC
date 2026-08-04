const db = require("../config/db");

// ==========================================
// LISTAR REQUISITOS
// GET /api/requisitos
// ==========================================
const listarRequisitos = (req, res) => {

    const sql = `
        SELECT
            id,
            nombre,
            descripcion,
            obligatorio,
            estado,
            fecha_creacion
        FROM requisitos
        ORDER BY id DESC
    `;

    db.query(sql, (err, resultados) => {

        if (err) {
            return res.status(500).json({
                mensaje: "Error al consultar los requisitos",
                error: err.message
            });
        }

        res.json(resultados);
    });
};


// ==========================================
// OBTENER REQUISITO POR ID
// GET /api/requisitos/:id
// ==========================================
const obtenerRequisito = (req, res) => {

    const { id } = req.params;

    const sql = `
        SELECT
            id,
            nombre,
            descripcion,
            obligatorio,
            estado,
            fecha_creacion
        FROM requisitos
        WHERE id = ?
    `;

    db.query(sql, [id], (err, resultados) => {

        if (err) {
            return res.status(500).json({
                mensaje: "Error al consultar el requisito",
                error: err.message
            });
        }

        if (resultados.length === 0) {
            return res.status(404).json({
                mensaje: "Requisito no encontrado"
            });
        }

        res.json(resultados[0]);
    });
};


// ==========================================
// CREAR REQUISITO
// POST /api/requisitos
// ==========================================
const crearRequisito = (req, res) => {

    const {
        nombre,
        descripcion,
        obligatorio
    } = req.body;

    // Validación
    if (!nombre) {
        return res.status(400).json({
            mensaje: "El nombre del requisito es obligatorio"
        });
    }

    const sql = `
        INSERT INTO requisitos
        (
            nombre,
            descripcion,
            obligatorio
        )
        VALUES (?, ?, ?)
    `;

    const valores = [
        nombre,
        descripcion || null,
        obligatorio !== undefined ? obligatorio : true
    ];

    db.query(sql, valores, (err, resultado) => {

        if (err) {

            if (err.code === "ER_DUP_ENTRY") {
                return res.status(409).json({
                    mensaje: "El requisito ya existe"
                });
            }

            return res.status(500).json({
                mensaje: "Error al registrar el requisito",
                error: err.message
            });
        }

        res.status(201).json({
            mensaje: "Requisito registrado correctamente",
            id: resultado.insertId
        });
    });
};


// ==========================================
// ACTUALIZAR REQUISITO
// PUT /api/requisitos/:id
// ==========================================
const actualizarRequisito = (req, res) => {

    const { id } = req.params;

    const {
        nombre,
        descripcion,
        obligatorio,
        estado
    } = req.body;

    if (!nombre || estado === undefined) {
        return res.status(400).json({
            mensaje: "El nombre y estado son obligatorios"
        });
    }

    const sql = `
        UPDATE requisitos
        SET
            nombre = ?,
            descripcion = ?,
            obligatorio = ?,
            estado = ?
        WHERE id = ?
    `;

    const valores = [
        nombre,
        descripcion || null,
        obligatorio !== undefined ? obligatorio : true,
        estado,
        id
    ];

    db.query(sql, valores, (err, resultado) => {

        if (err) {

            if (err.code === "ER_DUP_ENTRY") {
                return res.status(409).json({
                    mensaje: "El requisito ya existe"
                });
            }

            return res.status(500).json({
                mensaje: "Error al actualizar el requisito",
                error: err.message
            });
        }

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                mensaje: "Requisito no encontrado"
            });
        }

        res.json({
            mensaje: "Requisito actualizado correctamente"
        });
    });
};


// ==========================================
// DESACTIVAR REQUISITO
// DELETE /api/requisitos/:id
// ==========================================
const eliminarRequisito = (req, res) => {

    const { id } = req.params;

    const sql = `
        UPDATE requisitos
        SET estado = FALSE
        WHERE id = ?
    `;

    db.query(sql, [id], (err, resultado) => {

        if (err) {
            return res.status(500).json({
                mensaje: "Error al desactivar el requisito",
                error: err.message
            });
        }

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                mensaje: "Requisito no encontrado"
            });
        }

        res.json({
            mensaje: "Requisito desactivado correctamente"
        });
    });
};


module.exports = {
    listarRequisitos,
    obtenerRequisito,
    crearRequisito,
    actualizarRequisito,
    eliminarRequisito
};