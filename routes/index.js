import { Router } from 'express';
import UserRoutes from './User.route.js';

const router = new Router();

router.use('/user', UserRoutes);

export default router;
