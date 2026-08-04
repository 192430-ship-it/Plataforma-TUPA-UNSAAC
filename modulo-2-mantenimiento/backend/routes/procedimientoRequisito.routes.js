const express = require("express");

const router = express.Router();

const {
    listarRelaciones,
    obtenerRequisitosPorProcedimiento,
    asignarRequisito,
    actualizarRelacion,
    eliminarRelacion
} = require("../controllers/procedimientoRequisito.controller");


// Listar todas las relaciones
router.get("/", listarRelaciones);

// Obtener requisitos de un procedimiento
router.get(
    "/procedimiento/:id",
    obtenerRequisitosPorProcedimiento
);

// Asignar requisito
router.post("/", asignarRequisito);

// Actualizar relación
router.put("/:id", actualizarRelacion);

// Eliminar relación
router.delete("/:id", eliminarRelacion);


module.exports = router;