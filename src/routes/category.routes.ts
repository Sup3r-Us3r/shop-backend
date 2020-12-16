import { Router } from 'express';
import multer from 'multer';

import multerConfig from '../config/multer';

import CategoryController from '../app/controllers/CategoryController';

const upload = multer(multerConfig);

const categoryRouter = Router();

categoryRouter.post(
  '/create',
  upload.single('image'),
  CategoryController.create
);
categoryRouter.put(
  '/update/:id',
  upload.single('image'),
  CategoryController.update
);
categoryRouter.delete('/delete/:id', CategoryController.delete);
categoryRouter.get('/show/:id', CategoryController.show);
categoryRouter.get('/index', CategoryController.index);

export default categoryRouter;
