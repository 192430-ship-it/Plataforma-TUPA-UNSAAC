const express = require('express');
const bcrypt = require('bcryptjs');
const pool = require('../config/db');

const router = express.Router();

router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Se requieren usuario y contraseña.' });
    }

    try {
        const [rows] = await pool.query(
            'SELECT id_admin, username, password_hash, nombres, apellidos, activo FROM usuarios_administrativos WHERE username = ? LIMIT 1',
            [username]
        );

        if (rows.length === 0) {
            return res.status(401).json({ error: 'Usuario o contraseña incorrectos.' });
        }

        const user = rows[0];
        if (user.activo === 0) {
            return res.status(403).json({ error: 'Usuario deshabilitado. Contacte con el administrador.' });
        }

        const isValidPassword = await bcrypt.compare(password, user.password_hash);
        const isPlainPasswordMatch = password === user.password_hash;

        if (!isValidPassword && !isPlainPasswordMatch) {
            return res.status(401).json({ error: 'Usuario o contraseña incorrectos.' });
        }

        return res.json({
            message: 'Inicio de sesión exitoso.',
            user: {
                id: user.id_admin,
                username: user.username,
                nombres: user.nombres,
                apellidos: user.apellidos
            }
        });
    } catch (error) {
        console.error('Error autenticando administrador:', error);
        return res.status(500).json({ error: 'Error interno del servidor.' });
    }
});

module.exports = router;
