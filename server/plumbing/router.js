import { Router } from 'express';

import indexController from '../controllers/index';
import apiController from '../controllers/api';

import { listOfApis } from '../util/loadData';

var router = Router({ strict: true });

router.get('/', indexController.get);

listOfApis.forEach(apiName => {
    router.get('/api/' + apiName, (req, res, next) => apiController.get(req, res, next, apiName));
});

export default router;
