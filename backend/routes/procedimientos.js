const express = require('express');
const router = express.Router();
const pool = require('../config/db');

function parseProcedimiento(row) {
  return {
    id: row.id,
    codigo: row.codigo,
    titulo: row.titulo,
    categoria: row.categoria,
    categoria_nombre: row.categoria_nombre,
    costo: row.costo,
    tiempo: row.tiempo,
    silencio_administrativo: row.silencio_administrativo,
    silencio_tipo: row.silencio_tipo,
    es_gratuito: !!row.es_gratuito,
    requisitos: typeof row.requisitos === 'string' ? JSON.parse(row.requisitos) : row.requisitos
  };
}

router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM procedimientos ORDER BY codigo');
    res.json(rows.map(parseProcedimiento));
  } catch (err) {
    console.error('Error listando procedimientos:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

router.get('/:codigo', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM procedimientos WHERE codigo = ?', [req.params.codigo]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Procedimiento no encontrado' });
    }

    res.json(parseProcedimiento(rows[0]));
  } catch (err) {
    console.error('Error obteniendo procedimiento:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;
