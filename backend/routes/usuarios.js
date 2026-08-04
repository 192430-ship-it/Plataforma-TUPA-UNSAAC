const express = require('express');
const router = express.Router();
const pool = require('../config/db');

router.get('/:documento', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, tipo, documento, nombres, facultad, correo, telefono FROM usuarios WHERE documento = ?',
      [req.params.documento]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Documento no encontrado. Verifique su código o DNI.' });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error('Error buscando usuario:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;
