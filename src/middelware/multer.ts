import multer from 'multer';
import path from 'path';

// crea un directorio ./tmp si no existe y pon ahí los uploads
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, path.join(__dirname, '../../tmp'));
  },
  filename: (_req, file, cb) => {
    // mantenemos el nombre original
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

export default multer({ storage });