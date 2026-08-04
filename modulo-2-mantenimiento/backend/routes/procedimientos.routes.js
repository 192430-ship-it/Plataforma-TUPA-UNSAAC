const express = require("express");

const router = express.Router();

const {
    listarProcedimientos,
    obtenerProcedimiento,
    crearProcedimiento,
    actualizarProcedimiento,
    eliminarProcedimiento
} = require("../controllers/procedimientos.controller");

router.get("/", listarProcedimientos);

router.get("/:id", obtenerProcedimiento);

router.post("/", crearProcedimiento);

router.put("/:id", actualizarProcedimiento);

router.delete("/:id", eliminarProcedimiento);

module.exports = router;