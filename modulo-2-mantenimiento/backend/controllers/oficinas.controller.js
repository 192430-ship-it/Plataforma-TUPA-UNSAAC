const db = require("../config/db");

// ==========================================
// LISTAR OFICINAS
// GET /api/oficinas
// ==========================================
const listarOficinas = (req, res) => {

    const sql = `
        SELECT
            id,
            nombre,
            descripcion,
            estado,
            fecha_creacion
        FROM oficinas
        ORDER BY id DESC
    `;

    db.query(sql, (err, resultados) => {

        if (err) {
            return res.status(500).json({
                mensaje: "Error al consultar las oficinas",
                error: err.message
            });
        }

        res.json(resultados);
    });
};


// ==========================================
// OBTENER OFICINA POR ID
// GET /api/oficinas/:id
// ==========================================
const obtenerOficina = (req, res) => {

    const { id } = req.params;

    const sql = `
        SELECT
            id,
            nombre,
            descripcion,
            estado,
            fecha_creacion
        FROM oficinas
        WHERE id = ?
    `;

    db.query(sql, [id], (err, resultados) => {

        if (err) {
            return res.status(500).json({
                mensaje: "Error al consultar la oficina",
                error: err.message
            });
        }

        if (resultados.length === 0) {
            return res.status(404).json({
                mensaje: "Oficina no encontrada"
            });
        }

        res.json(resultados[0]);
    });
};


// ==========================================
// CREAR OFICINA
// POST /api/oficinas
// ==========================================
const crearOficina = (req, res) => {

    const { nombre, descripcion } = req.body;

    if (!nombre) {
        return res.status(400).json({
            mensaje: "El nombre de la oficina es obligatorio"
        });
    }

    const sql = `
        INSERT INTO oficinas
        (nombre, descripcion)
        VALUES (?, ?)
    `;

    db.query(
        sql,
        [nombre, descripcion || null],
        (err, resultado) => {

            if (err) {
                return res.status(500).json({
                    mensaje: "Error al registrar la oficina",
                    error: err.message
                });
            }

            res.status(201).json({
                mensaje: "Oficina registrada correctamente",
                id: resultado.insertId
            });
        }
    );
};


// ==========================================
// ACTUALIZAR OFICINA
// PUT /api/oficinas/:id
// ==========================================
const actualizarOficina = (req, res) => {

    const { id } = req.params;

    const {
        nombre,
        descripcion,
        estado
    } = req.body;

    if (!nombre || estado === undefined) {
        return res.status(400).json({
            mensaje: "El nombre y estado son obligatorios"
        });
    }

    const sql = `
        UPDATE oficinas
        SET
            nombre = ?,
            descripcion = ?,
            estado = ?
        WHERE id = ?
    `;

    const valores = [
        nombre,
        descripcion || null,
        estado,
        id
    ];

    db.query(sql, valores, (err, resultado) => {

        if (err) {
            return res.status(500).json({
                mensaje: "Error al actualizar la oficina",
                error: err.message
            });
        }

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                mensaje: "Oficina no encontrada"
            });
        }

        res.json({
            mensaje: "Oficina actualizada correctamente"
        });
    });
};


// ==========================================
// DESACTIVAR OFICINA
// DELETE /api/oficinas/:id
// ==========================================
const eliminarOficina = (req, res) => {

    const { id } = req.params;

    const sql = `
        UPDATE oficinas
        SET estado = FALSE
        WHERE id = ?
    `;

    db.query(sql, [id], (err, resultado) => {

        if (err) {
            return res.status(500).json({
                mensaje: "Error al desactivar la oficina",
                error: err.message
            });
        }

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                mensaje: "Oficina no encontrada"
            });
        }

        res.json({
            mensaje: "Oficina desactivada correctamente"
        });
    });
};


module.exports = {
    listarOficinas,
    obtenerOficina,
    crearOficina,
    actualizarOficina,
    eliminarOficina
};