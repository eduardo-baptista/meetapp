import { Router } from 'express';
import multer from 'multer';

//controllers
import userController from './app/controllers/userController';
import sessionController from './app/controllers/sessionController';
import fileController from './app/controllers/fileController';
import meetupController from './app/controllers/meetupController';
import organizingController from './app/controllers/organizingController';
import subscriptionController from './app/controllers/subscriptionController';

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

//list all meetup by date
routes.get('/meetups', meetupController.index);
//create meetup
routes.post('/meetups', meetupController.store);
//edit meetups
routes.put('/meetups/:id', meetupController.update);
//delet meetup created by the logged user
routes.delete('/meetups/:id', meetupController.delete);

//get meetups created by the logged user
routes.get('/organizing', organizingController.index);

//create subscription
routes.post('/subscriptions', subscriptionController.store);
//list all subscriptions
routes.get('/subscriptions', subscriptionController.index);

export default routes;
