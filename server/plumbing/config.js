import _ from 'lodash';
import npmConfig from '../../package.json';

var config = {
    version: npmConfig.version,
    server: {
        port: 3003
    }
};

try {
    config = _.assign(config, require('./config.json'));
} catch (e) {
    console.warn('Config file server/config.json not found. Using defaults instead.');
    console.log(config);
}

export default config;
