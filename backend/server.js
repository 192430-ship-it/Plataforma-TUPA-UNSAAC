require('dotenv').config({ path: require('path').join(__dirname, '../.env') });

const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const usuariosRouter = require('./routes/usuarios');
const procedimientosRouter = require('./routes/procedimientos');
const tramitesRouter = require('./routes/tramites');
const authRouter = require('./routes/auth');
const adminRouter = require('./routes/admin');

const app = express();

const uploadDir = path.join(__dirname, process.env.UPLOAD_DIR || 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/usuarios', usuariosRouter);
app.use('/api/procedimientos', procedimientosRouter);
app.use('/api/tramites', tramitesRouter);
app.use('/api/auth', authRouter);
app.use('/api/admin', adminRouter);

app.use(express.static(path.join(__dirname, '..')));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'TUPA UNSAAC API funcionando' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message || 'Error interno del servidor' });
});

const startPort = Number(process.env.PORT) || 3000;
const maxPort = startPort + 10;

function startServer(port) {
  const server = app.listen(port, () => {
    console.log(`Servidor TUPA UNSAAC corriendo en http://localhost:${port}`);
    console.log(`Frontend: http://localhost:${port}/index.html`);
    console.log(`Trámites: http://localhost:${port}/tramites/tramites.html`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      if (port < maxPort) {
        console.warn(`Puerto ${port} en uso. Probando el siguiente puerto ${port + 1}...`);
        startServer(port + 1);
      } else {
        console.error(`Error: no se encontró un puerto libre entre ${startPort} y ${maxPort}. Cierra la aplicación usando el puerto ocupado o configura otro PORT.`);
        process.exit(1);
      }
    } else {
      console.error('Error al iniciar el servidor:', err);
      process.exit(1);
    }
  });
}

startServer(startPort);
