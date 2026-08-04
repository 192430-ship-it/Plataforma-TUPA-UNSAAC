const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = path.join(__dirname, '..', process.env.UPLOAD_DIR || 'uploads');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const tramiteDir = path.join(uploadDir, String(req.params.id || 'temp'));
    if (!fs.existsSync(tramiteDir)) {
      fs.mkdirSync(tramiteDir, { recursive: true });
    }
    cb(null, tramiteDir);
  },
  filename: (req, file, cb) => {
    const requisito = req.body.requisito_codigo || 'doc';
    const ext = path.extname(file.originalname);
    const safeName = `${requisito}_${Date.now()}${ext}`;
    cb(null, safeName);
  }
});

const fileFilter = (req, file, cb) => {
  const allowed = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Formato no permitido. Use PDF, JPG o PNG.'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }
});

module.exports = upload;
