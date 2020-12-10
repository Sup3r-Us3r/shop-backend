import { Router } from 'express';
import multer from 'multer';

import multerConfig from '../config/multer';

import UserController from '../app/controllers/UserController';

const userRouter = Router();

const upload = multer(multerConfig);

userRouter.post('/login', UserController.login);
userRouter.get('/index', UserController.index);
userRouter.get('/show/:id', UserController.show);
userRouter.post('/create', upload.single('photo'), UserController.create);
userRouter.put('/update/:id', upload.single('photo'), UserController.update);
userRouter.delete('/delete/:id', UserController.delete);

export default userRouter;
