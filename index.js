var register = require('babel-register');

// Parse modules required after this register() call using the Babel transpiler
register({ presets: ['react', 'es2015'] });

require('./server/main');
