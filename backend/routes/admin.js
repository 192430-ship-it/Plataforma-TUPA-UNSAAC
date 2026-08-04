const express = require('express');
const pool = require('../config/db');

const router = express.Router();

router.get('/dashboard', async (req, res) => {
  try {
    const [countRows] = await pool.query('SELECT COUNT(*) AS total FROM tramites');
    const totalTramites = countRows[0]?.total || 0;

    const [avgRows] = await pool.query(
      `SELECT
         ROUND(AVG(TIMESTAMPDIFF(SECOND, fecha_registro, IFNULL(fecha_actualizacion, NOW()))) / 86400, 1) AS avg_days
       FROM tramites`
    );
    const avgTiempoDias = avgRows[0]?.avg_days || 0;

    const [approvalRows] = await pool.query(
      `SELECT
         SUM(estado = 'aprobado') AS aprobados,
         COUNT(*) AS total
       FROM tramites`
    );
    const totalAprobados = approvalRows[0]?.aprobados || 0;
    const approvalRate = totalTramites > 0 ? Math.round((totalAprobados / totalTramites) * 100) : 0;

    const [facultyRows] = await pool.query(
      `SELECT
         COALESCE(u.facultad, 'Sin Facultad') AS facultad,
         COUNT(*) AS total
       FROM tramites t
       LEFT JOIN usuarios u ON t.id_usuario = u.id_usuario
       GROUP BY facultad
       ORDER BY total DESC
       LIMIT 6`
    );

    const [pendingRows] = await pool.query(
      `SELECT
         t.id_tramite,
         t.numero_expediente,
         CONCAT(u.nombres, ' ', u.apellidos) AS interesado,
         COALESCE(u.facultad, 'Sin Facultad') AS facultad,
         t.estado,
         p.nombre AS procedimiento,
         p.silencio_administrativo,
         DATE_FORMAT(t.fecha_registro, '%Y-%m-%d') AS fecha_registro
       FROM tramites t
       LEFT JOIN usuarios u ON t.id_usuario = u.id_usuario
       LEFT JOIN procedimientos p ON t.id_procedimiento = p.id_procedimiento
       WHERE t.estado IN ('registrado', 'en_revision', 'observado')
       ORDER BY t.fecha_registro ASC
       LIMIT 10`
    );

    const [baseLegalRows] = await pool.query(
      `SELECT codigo, nombre, base_legal, silencio_administrativo
       FROM procedimientos
       WHERE base_legal IS NOT NULL AND base_legal <> ''
       ORDER BY codigo
       LIMIT 5`
    );

    const [docsRows] = await pool.query('SELECT COUNT(*) AS total_documentos FROM documentos');
    const documentosTotales = docsRows[0]?.total_documentos || 0;

    const [historyRows] = await pool.query(
      `SELECT estado, COUNT(*) AS total
       FROM tramites
       GROUP BY estado`
    );

    res.json({
      totalTramites,
      avgTiempoDias,
      approvalRate,
      facultades: facultyRows,
      pending: pendingRows,
      baseLegal: baseLegalRows,
      documentosTotales,
      history: historyRows
    });
  } catch (err) {
    console.error('Error obteniendo dashboard administrativo:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;
