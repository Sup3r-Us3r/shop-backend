import { Router } from 'express';

import userRouter from './user.routes';
import categoryRouter from './category.routes';
import productRouter from './product.routes';

const routes = Router();

routes.use('/user', userRouter);
routes.use('/category', categoryRouter);
routes.use('/product', productRouter);

export default routes;
