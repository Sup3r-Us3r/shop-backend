import multer, { Options } from 'multer';
// import { resolve } from 'path';
import { randomBytes } from 'crypto';

export default {
  fileFilter: (req, file, cb) => {
    const allowMimes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
    ];

    if (!allowMimes.includes(file.mimetype)) {
      return cb(new Error('Invalid file type'));
    }

    return cb(null, true);
  },
  storage: multer.diskStorage({
    // destination: resolve(__dirname, '..', '..', 'uploads'),
    filename: (req, file, cb) => {
      const filename = `${randomBytes(6).toString('hex')}-${file.originalname}`;

      return cb(null, filename);
    },
  }),
} as Options;
