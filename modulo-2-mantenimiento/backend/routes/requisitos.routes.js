const express = require("express");

const router = express.Router();

const {
    listarRequisitos,
    obtenerRequisito,
    crearRequisito,
    actualizarRequisito,
    eliminarRequisito
} = require("../controllers/requisitos.controller");


// GET /api/requisitos
router.get("/", listarRequisitos);

// GET /api/requisitos/:id
router.get("/:id", obtenerRequisito);

// POST /api/requisitos
router.post("/", crearRequisito);

// PUT /api/requisitos/:id
router.put("/:id", actualizarRequisito);

// DELETE /api/requisitos/:id
router.delete("/:id", eliminarRequisito);

module.exports = router;