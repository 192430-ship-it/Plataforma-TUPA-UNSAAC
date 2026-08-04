const express = require("express");

const router = express.Router();

const {
    listarCategorias,
    obtenerCategoria,
    crearCategoria,
    actualizarCategoria,
    eliminarCategoria
} = require("../controllers/categorias.controller");


// GET /api/categorias
router.get("/", listarCategorias);

// GET /api/categorias/:id
router.get("/:id", obtenerCategoria);

// POST /api/categorias
router.post("/", crearCategoria);

// PUT /api/categorias/:id
router.put("/:id", actualizarCategoria);

// DELETE /api/categorias/:id
router.delete("/:id", eliminarCategoria);

module.exports = router;