import { Router } from 'express';
import multer from 'multer';

//controllers
import userController from './app/controllers/userController';
import sessionController from './app/controllers/sessionController';
import fileController from './app/controllers/fileController';

//middleware
import authMiddleware from './app/middleware/auth';
import multerConfig from './config/multer';

const routes = Router();
const upload = multer(multerConfig);

//create user
routes.post('/users', userController.store);
//create session
routes.post('/sessions', sessionController.store);

//auth middleware
routes.use(authMiddleware);

//edit user
routes.put('/users', userController.update);

//save files
routes.post('/files', upload.single('file'), fileController.store);

export default routes;
