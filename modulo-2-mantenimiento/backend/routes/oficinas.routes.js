const express = require("express");

const router = express.Router();

const {
    listarOficinas,
    obtenerOficina,
    crearOficina,
    actualizarOficina,
    eliminarOficina
} = require("../controllers/oficinas.controller");

router.get("/", listarOficinas);

router.get("/:id", obtenerOficina);

router.post("/", crearOficina);

router.put("/:id", actualizarOficina);

router.delete("/:id", eliminarOficina);

module.exports = router;