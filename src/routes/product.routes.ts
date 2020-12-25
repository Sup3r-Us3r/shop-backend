import { Router } from 'express';
import multer from 'multer';

import multerConfig from '../config/multer';

import ProductController from '../app/controllers/ProductController';

const upload = multer(multerConfig);

const productRouter = Router();

productRouter.post(
  '/create',
  upload.array('images[]'),
  ProductController.create
);
productRouter.put(
  '/update/:id',
  upload.array('images[]'),
  ProductController.update
);
productRouter.delete('/delete/:id', ProductController.delete);
productRouter.get('/show/:id', ProductController.show);
productRouter.get('/index', ProductController.index);
productRouter.get('/togglestar/:id', ProductController.toggleStar);

export default productRouter;
