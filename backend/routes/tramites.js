const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const upload = require('../middleware/upload');
const path = require('path');

async function generarExpediente() {
  const year = new Date().getFullYear();
  const [rows] = await pool.query(
    'SELECT COUNT(*) as total FROM tramites WHERE expediente LIKE ?',
    [`EXP-${year}-%`]
  );
  const num = String(rows[0].total + 1).padStart(5, '0');
  return `EXP-${year}-${num}`;
}

function simularNotificacionEmail(expediente, correo) {
  console.log(`[NOTIFICACIÓN] Trámite ${expediente} registrado. Email enviado a: ${correo || 'sin correo'}`);
}

router.get('/stats', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT estado, COUNT(*) as total FROM tramites GROUP BY estado'
    );
    res.json(rows);
  } catch (err) {
    console.error('Error obteniendo stats:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

router.post('/', async (req, res) => {
  const conn = await pool.getConnection();
  try {
    const { tipo, documento, nombres, facultad, correo, telefono, procedimiento_codigo } = req.body;

    if (!documento || !nombres || !procedimiento_codigo) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    await conn.beginTransaction();

    let [usuarios] = await conn.query('SELECT id FROM usuarios WHERE documento = ?', [documento]);
    let usuarioId;

    if (usuarios.length === 0) {
      const [result] = await conn.query(
        'INSERT INTO usuarios (tipo, documento, nombres, facultad, correo, telefono) VALUES (?, ?, ?, ?, ?, ?)',
        [tipo || 'estudiante', documento, nombres, facultad || null, correo || null, telefono || null]
      );
      usuarioId = result.insertId;
    } else {
      usuarioId = usuarios[0].id;
      await conn.query(
        'UPDATE usuarios SET tipo=?, nombres=?, facultad=?, correo=?, telefono=? WHERE id=?',
        [tipo || 'estudiante', nombres, facultad || null, correo || null, telefono || null, usuarioId]
      );
    }

    const [procs] = await conn.query('SELECT id FROM procedimientos WHERE codigo = ?', [procedimiento_codigo]);
    if (procs.length === 0) {
      await conn.rollback();
      return res.status(404).json({ error: 'Procedimiento no encontrado' });
    }

    const expediente = await generarExpediente();
    const [tramiteResult] = await conn.query(
      'INSERT INTO tramites (expediente, usuario_id, procedimiento_id, estado) VALUES (?, ?, ?, ?)',
      [expediente, usuarioId, procs[0].id, 'registrado']
    );

    const tramiteId = tramiteResult.insertId;

    await conn.query(
      'INSERT INTO estados_historial (tramite_id, estado, observacion) VALUES (?, ?, ?)',
      [tramiteId, 'registrado', 'Trámite registrado exitosamente']
    );

    await conn.commit();

    simularNotificacionEmail(expediente, correo);

    res.status(201).json({
      id: tramiteId,
      expediente,
      estado: 'registrado',
      mensaje: 'Trámite registrado exitosamente'
    });
  } catch (err) {
    await conn.rollback();
    console.error('Error creando trámite:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  } finally {
    conn.release();
  }
});

router.post('/:id/documentos', upload.single('archivo'), async (req, res) => {
  try {
    const tramiteId = req.params.id;

    if (!req.file) {
      return res.status(400).json({ error: 'No se recibió ningún archivo' });
    }

    const requisitoCodigo = req.body.requisito_codigo || 'general';

    const [tramites] = await pool.query('SELECT id FROM tramites WHERE id = ?', [tramiteId]);
    if (tramites.length === 0) {
      return res.status(404).json({ error: 'Trámite no encontrado' });
    }

    const rutaRelativa = path.join(process.env.UPLOAD_DIR || 'uploads', String(tramiteId), req.file.filename);

    const [result] = await pool.query(
      'INSERT INTO documentos (tramite_id, nombre_original, ruta, mime_type, tamano_bytes, requisito_codigo) VALUES (?, ?, ?, ?, ?, ?)',
      [tramiteId, req.file.originalname, rutaRelativa, req.file.mimetype, req.file.size, requisitoCodigo]
    );

    res.status(201).json({
      id: result.insertId,
      nombre_original: req.file.originalname,
      requisito_codigo: requisitoCodigo,
      tamano_bytes: req.file.size,
      mensaje: 'Documento subido correctamente'
    });
  } catch (err) {
    console.error('Error subiendo documento:', err);
    res.status(500).json({ error: err.message || 'Error interno del servidor' });
  }
});

router.get('/:expediente', async (req, res) => {
  try {
    const expediente = req.params.expediente;

    const [rows] = await pool.query(
      `SELECT t.id, t.expediente, t.estado, t.fecha_registro,
              u.nombres, u.documento, u.correo, u.facultad,
              p.codigo as procedimiento_codigo, p.titulo as procedimiento_titulo,
              p.costo, p.tiempo, p.silencio_administrativo
       FROM tramites t
       JOIN usuarios u ON t.usuario_id = u.id
       JOIN procedimientos p ON t.procedimiento_id = p.id
       WHERE t.expediente = ?`,
      [expediente]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Expediente no encontrado' });
    }

    const tramite = rows[0];

    const [documentos] = await pool.query(
      'SELECT id, nombre_original, requisito_codigo, tamano_bytes, fecha_subida FROM documentos WHERE tramite_id = ?',
      [tramite.id]
    );

    const [historial] = await pool.query(
      'SELECT estado, observacion, fecha FROM estados_historial WHERE tramite_id = ? ORDER BY fecha ASC',
      [tramite.id]
    );

    res.json({ ...tramite, documentos, historial });
  } catch (err) {
    console.error('Error consultando trámite:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;
