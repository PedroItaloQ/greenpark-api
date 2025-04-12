import { diskStorage } from 'multer';
import { extname } from 'path';

export const multerConfig = {
  storage: diskStorage({
    destination: './uploads',
    filename: (req, file, cb) => {
      const fileExt = extname(file.originalname);
      const fileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${fileExt}`;
      cb(null, fileName);
    },
  }),
};
