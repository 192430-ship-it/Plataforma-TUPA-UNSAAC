const db = require("../config/db");

// ==========================================
// LISTAR CATEGORÍAS
// GET /api/categorias
// ==========================================
const listarCategorias = (req, res) => {

    const sql = `
        SELECT
            id,
            nombre,
            descripcion,
            estado,
            fecha_creacion
        FROM categorias
        ORDER BY id DESC
    `;

    db.query(sql, (err, resultados) => {

        if (err) {
            console.error("Error:", err);

            return res.status(500).json({
                mensaje: "Error al consultar las categorías",
                error: err.message
            });
        }

        res.json(resultados);
    });
};


// ==========================================
// OBTENER CATEGORÍA POR ID
// GET /api/categorias/:id
// ==========================================
const obtenerCategoria = (req, res) => {

    const { id } = req.params;

    const sql = `
        SELECT
            id,
            nombre,
            descripcion,
            estado,
            fecha_creacion
        FROM categorias
        WHERE id = ?
    `;

    db.query(sql, [id], (err, resultados) => {

        if (err) {
            return res.status(500).json({
                mensaje: "Error al consultar la categoría",
                error: err.message
            });
        }

        if (resultados.length === 0) {
            return res.status(404).json({
                mensaje: "Categoría no encontrada"
            });
        }

        res.json(resultados[0]);
    });
};


// ==========================================
// CREAR CATEGORÍA
// POST /api/categorias
// ==========================================
const crearCategoria = (req, res) => {

    const { nombre, descripcion } = req.body;

    if (!nombre) {
        return res.status(400).json({
            mensaje: "El nombre de la categoría es obligatorio"
        });
    }

    const sql = `
        INSERT INTO categorias
        (nombre, descripcion)
        VALUES (?, ?)
    `;

    db.query(
        sql,
        [nombre, descripcion || null],
        (err, resultado) => {

            if (err) {

                if (err.code === "ER_DUP_ENTRY") {
                    return res.status(409).json({
                        mensaje: "La categoría ya existe"
                    });
                }

                return res.status(500).json({
                    mensaje: "Error al registrar la categoría",
                    error: err.message
                });
            }

            res.status(201).json({
                mensaje: "Categoría registrada correctamente",
                id: resultado.insertId
            });
        }
    );
};


// ==========================================
// ACTUALIZAR CATEGORÍA
// PUT /api/categorias/:id
// ==========================================
const actualizarCategoria = (req, res) => {

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
        UPDATE categorias
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

            if (err.code === "ER_DUP_ENTRY") {
                return res.status(409).json({
                    mensaje: "La categoría ya existe"
                });
            }

            return res.status(500).json({
                mensaje: "Error al actualizar la categoría",
                error: err.message
            });
        }

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                mensaje: "Categoría no encontrada"
            });
        }

        res.json({
            mensaje: "Categoría actualizada correctamente"
        });
    });
};


// ==========================================
// DESACTIVAR CATEGORÍA
// DELETE /api/categorias/:id
// ==========================================
const eliminarCategoria = (req, res) => {

    const { id } = req.params;

    const sql = `
        UPDATE categorias
        SET estado = FALSE
        WHERE id = ?
    `;

    db.query(sql, [id], (err, resultado) => {

        if (err) {
            return res.status(500).json({
                mensaje: "Error al desactivar la categoría",
                error: err.message
            });
        }

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                mensaje: "Categoría no encontrada"
            });
        }

        res.json({
            mensaje: "Categoría desactivada correctamente"
        });
    });
};


module.exports = {
    listarCategorias,
    obtenerCategoria,
    crearCategoria,
    actualizarCategoria,
    eliminarCategoria
};