import config from '../plumbing/config';
import { apiColumnHeadings } from '../util/loadData';
import _ from 'lodash';

export default {
    get (req, res) {
        var clientConfig = _.clone(config);
        clientConfig.api = apiColumnHeadings;
        clientConfig.env = (process.env.NODE_ENV || 'development');

        res.render('template', {
            config: clientConfig
        });
    }
};
