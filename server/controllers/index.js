import config from '../plumbing/config';

export default {
    get (req, res) {
        res.render('template', {
            title: 'MetOcean Data Fun',
            year: new Date().getFullYear(),
            config
        });
    }
};
