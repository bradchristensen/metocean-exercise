import config from '../plumbing/config';
import { apiColumnHeadings } from '../util/loadData';
import _ from 'lodash';

export default {
    get (req, res) {
        var clientConfig = _.clone(config);
        clientConfig.api = apiColumnHeadings;

        res.render('template', {
            title: 'MetOcean Data Fun',
            year: new Date().getFullYear(),
            config: clientConfig
        });
    }
};
