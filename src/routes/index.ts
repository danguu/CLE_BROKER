import { Router } from 'express';
import formsRouter from '../modules/forms/forms.router';
import tourismRouter from '../modules/tourism/tourism.router';
import cleBrokerRouter from '../modules/cle_broker/cleBroker.router';
import authRouter from '../modules/users/auth.router';
import publicRouter from '../modules/public/public.router';
import healthRouter from './health';

const router = Router();

router.use('/forms', formsRouter);
router.use('/tourism', tourismRouter);
router.use('/cle-broker', cleBrokerRouter);
router.use('/auth', authRouter);
router.use('/public', publicRouter);
router.use('/', healthRouter);

export default router;
