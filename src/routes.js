import { Router } from 'express';

//controllers
import userController from './app/controllers/userController';
import sessionController from './app/controllers/sessionController';

//middleware
import authMiddleware from './app/middleware/auth';

const routes = Router();

//create user
routes.post('/users', userController.store);
//create session
routes.post('/sessions', sessionController.store);

//auth middleware
routes.use(authMiddleware);

//edit user
routes.put('/users', userController.update);

export default routes;
