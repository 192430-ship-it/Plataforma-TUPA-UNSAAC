const db = require("../config/db");

// ==========================================
// LISTAR RELACIONES
// GET /api/procedimiento-requisito
// ==========================================
const listarRelaciones = (req, res) => {

    const sql = `
        SELECT
            pr.id,
            pr.procedimiento_id,
            p.nombre AS procedimiento,
            pr.requisito_id,
            r.nombre AS requisito,
            r.obligatorio
        FROM procedimiento_requisito pr
        INNER JOIN procedimientos p
            ON pr.procedimiento_id = p.id
        INNER JOIN requisitos r
            ON pr.requisito_id = r.id
        ORDER BY pr.id DESC
    `;

    db.query(sql, (err, resultados) => {

        if (err) {
            return res.status(500).json({
                mensaje: "Error al consultar las relaciones",
                error: err.message
            });
        }

        res.json(resultados);
    });
};


// ==========================================
// CONSULTAR REQUISITOS DE UN PROCEDIMIENTO
// GET /api/procedimiento-requisito/procedimiento/:id
// ==========================================
const obtenerRequisitosPorProcedimiento = (req, res) => {

    const { id } = req.params;

    const sql = `
        SELECT
            pr.id,
            p.id AS procedimiento_id,
            p.nombre AS procedimiento,
            r.id AS requisito_id,
            r.nombre AS requisito,
            r.descripcion,
            r.obligatorio
        FROM procedimiento_requisito pr
        INNER JOIN procedimientos p
            ON pr.procedimiento_id = p.id
        INNER JOIN requisitos r
            ON pr.requisito_id = r.id
        WHERE pr.procedimiento_id = ?
        ORDER BY r.id
    `;

    db.query(sql, [id], (err, resultados) => {

        if (err) {
            return res.status(500).json({
                mensaje: "Error al consultar los requisitos del procedimiento",
                error: err.message
            });
        }

        res.json(resultados);
    });
};


// ==========================================
// ASIGNAR REQUISITO A PROCEDIMIENTO
// POST /api/procedimiento-requisito
// ==========================================
const asignarRequisito = (req, res) => {

    const {
        procedimiento_id,
        requisito_id
    } = req.body;

    if (!procedimiento_id || !requisito_id) {
        return res.status(400).json({
            mensaje: "procedimiento_id y requisito_id son obligatorios"
        });
    }

    const sql = `
        INSERT INTO procedimiento_requisito
        (procedimiento_id, requisito_id)
        VALUES (?, ?)
    `;

    db.query(
        sql,
        [procedimiento_id, requisito_id],
        (err, resultado) => {

            if (err) {

                if (err.code === "ER_DUP_ENTRY") {
                    return res.status(409).json({
                        mensaje: "El requisito ya está asignado al procedimiento"
                    });
                }

                if (err.code === "ER_NO_REFERENCED_ROW_2") {
                    return res.status(400).json({
                        mensaje: "El procedimiento o requisito no existe"
                    });
                }

                return res.status(500).json({
                    mensaje: "Error al asignar el requisito",
                    error: err.message
                });
            }

            res.status(201).json({
                mensaje: "Requisito asignado correctamente",
                id: resultado.insertId
            });
        }
    );
};


// ==========================================
// ACTUALIZAR RELACIÓN
// PUT /api/procedimiento-requisito/:id
// ==========================================
const actualizarRelacion = (req, res) => {

    const { id } = req.params;

    const {
        procedimiento_id,
        requisito_id
    } = req.body;

    if (!procedimiento_id || !requisito_id) {
        return res.status(400).json({
            mensaje: "procedimiento_id y requisito_id son obligatorios"
        });
    }

    const sql = `
        UPDATE procedimiento_requisito
        SET
            procedimiento_id = ?,
            requisito_id = ?
        WHERE id = ?
    `;

    db.query(
        sql,
        [procedimiento_id, requisito_id, id],
        (err, resultado) => {

            if (err) {
                return res.status(500).json({
                    mensaje: "Error al actualizar la relación",
                    error: err.message
                });
            }

            if (resultado.affectedRows === 0) {
                return res.status(404).json({
                    mensaje: "Relación no encontrada"
                });
            }

            res.json({
                mensaje: "Relación actualizada correctamente"
            });
        }
    );
};


// ==========================================
// ELIMINAR RELACIÓN
// DELETE /api/procedimiento-requisito/:id
// ==========================================
const eliminarRelacion = (req, res) => {

    const { id } = req.params;

    const sql = `
        DELETE FROM procedimiento_requisito
        WHERE id = ?
    `;

    db.query(sql, [id], (err, resultado) => {

        if (err) {
            return res.status(500).json({
                mensaje: "Error al eliminar la relación",
                error: err.message
            });
        }

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                mensaje: "Relación no encontrada"
            });
        }

        res.json({
            mensaje: "Requisito desasignado correctamente"
        });
    });
};


module.exports = {
    listarRelaciones,
    obtenerRequisitosPorProcedimiento,
    asignarRequisito,
    actualizarRelacion,
    eliminarRelacion
};