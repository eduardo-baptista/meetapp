import multer from 'multer';
import { resolve, extname } from 'path';
import crypto from 'crypto';

export default {
  storage: multer.diskStorage({
    destination: resolve(__dirname, '..', '..', 'tmp', 'uploads'),
    filename: function(req, file, cb) {
      crypto.randomBytes(16, (err, res) => {
        if (err) return cd(err);

        return cb(null, res.toString('hex') + extname(file.originalname));
      });
    },
  }),
};
