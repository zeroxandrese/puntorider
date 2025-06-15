import multer from 'multer';
import path from 'path';

const tmpDir = path.join(process.cwd(), 'tmp');

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, tmpDir);
  },
  filename: (_req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

export default multer({ storage });