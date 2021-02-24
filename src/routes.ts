import { Router } from 'express';

import { UsersController } from './controllers/UsersController';
import { SurveysController } from './controllers/SurveysController';

const router = Router();

router.post('/users', new UsersController().create);

router.get('/surveys', new SurveysController().show);
router.post('/surveys', new SurveysController().create);

export { router };