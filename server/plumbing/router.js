import { Router } from 'express';

import indexController from '../controllers/index';

var router = Router({ strict: true });

router.get('/', indexController.get);

export default router;
