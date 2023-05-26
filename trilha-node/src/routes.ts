import { Router } from 'express';

import { UsersController } from './controllers/UsersController';
import { SurveysController } from './controllers/SurveysController';
import { SendMailController } from './controllers/SendMailController';
import { AnswerController } from './controllers/AnswerController';
import { NpsController } from './controllers/NpsController';

const router = Router();

router.post('/users', new UsersController().create);

router.get('/surveys', new SurveysController().show);
router.post('/surveys', new SurveysController().create);

router.post('/sendMail', new SendMailController().execute);

router.get('/answers/:value', new AnswerController().execute);

router.get('/nps/:survey_id', new NpsController().calculate);

export { router };