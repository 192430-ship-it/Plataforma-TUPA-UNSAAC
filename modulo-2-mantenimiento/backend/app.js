const express = require("express");
const cors = require("cors");

const procedimientosRoutes = require("./routes/procedimientos.routes");
const categoriasRoutes = require("./routes/categorias.routes");
const oficinasRoutes = require("./routes/oficinas.routes");
const requisitosRoutes = require("./routes/requisitos.routes");
const procedimientoRequisitoRoutes =
    require("./routes/procedimientoRequisito.routes");

const app = express();
app.use(cors());

// Permitir recibir datos JSON
app.use(express.json());

// ==========================================
// RUTA PRINCIPAL
// ==========================================
app.get("/", (req, res) => {
    res.json({
        mensaje: "API Modulo 2 - Mantenimiento TUPA UNSAAC funcionando"
    });
});

// ==========================================
// RUTAS DE LA API
// ==========================================

app.use("/api/procedimientos", procedimientosRoutes);

app.use("/api/categorias", categoriasRoutes);

app.use("/api/oficinas", oficinasRoutes);

app.use("/api/requisitos", requisitosRoutes);

app.use(
    "/api/procedimiento-requisito",
    procedimientoRequisitoRoutes
);

module.exports = app;