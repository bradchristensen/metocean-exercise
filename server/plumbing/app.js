import express from 'express';
import bodyParser from 'body-parser';
import config from './config';
import errorHandler from 'errorhandler';
import expressValidator from 'express-validator';
import methodOverride from 'method-override';
import path from 'path';
import router from './router';
import { apiColumnHeadings } from '../util/loadData';
import _ from 'lodash';

var app = express();

// settings
app.set('env', process.env.NODE_ENV || 'development');
app.set('port', config.server.port || 3000);
app.set('views', path.join(__dirname, '../'));
app.set('view engine', 'ejs');

app.enable('trust proxy');

app.disable('x-powered-by');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(expressValidator());
app.use(methodOverride());

var distPath = express.static(path.normalize(__dirname + '/../../dist'));
app.use('/static', distPath);

app.use(router);

app.use(function handleNotFound (req, res, next) {
    res.status(404);

    if (req.accepts('html')) {
        var clientConfig = _.clone(config);
        clientConfig.api = apiColumnHeadings;
        clientConfig.env = (process.env.NODE_ENV || 'development');

        // TODO: Apart from returning an HTTP 404 status code, this 404 page is currently
        // just the same as the index page, since client-side routing hasn't been implemented
        res.render('template', {
            url: req.url,
            error: '404 Not found',
            config: clientConfig
        });
        return;
    }

    if (req.accepts('json')) {
        res.send({ error: 'Not found' });
        return;
    }

    res.type('txt').send('Not found');
});

app.use(errorHandler());

export default app;
