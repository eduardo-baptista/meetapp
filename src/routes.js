import { Router } from 'express';

//controllers
import userController from './app/controllers/userController';

const routes = Router();

//create user
routes.post('/users', userController.store);
//create session
routes.post('/sessions');

export default routes;
