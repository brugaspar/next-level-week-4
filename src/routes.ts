import { Router } from 'express';

import { UsersController } from './controllers/UsersController';
import { SurveysController } from './controllers/SurveysController';
import { SendMailController } from './controllers/SendMailController';

const router = Router();

router.post('/users', new UsersController().create);

router.get('/surveys', new SurveysController().show);
router.post('/surveys', new SurveysController().create);

router.post('/sendMail', new SendMailController().execute);

export { router };