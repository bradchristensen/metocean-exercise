import { Router } from 'express';

import indexController from '../controllers/index';
import apiController from '../controllers/api';

import { apiColumnHeadings } from '../util/loadData';

var router = Router({ strict: true });

router.get('/', indexController.get);
router.get('/api', apiController.get);

apiColumnHeadings.forEach(columnHeading => {
    var apiName = columnHeading.label;
    router.get('/api/' + apiName, (req, res, next) => apiController.get(req, res, next, apiName));
});

export default router;
