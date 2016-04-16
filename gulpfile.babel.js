import gulp from 'gulp';
import plumber from 'gulp-plumber';
import eslint from 'gulp-eslint';
import path from 'path';
import webpack from 'webpack';
import _ from 'lodash';

gulp.task('eslint', () => {
    return gulp.src(['client/**/*.js', 'server/**/*.js'])
        .pipe(plumber())
        .pipe(eslint())
        .pipe(eslint.format());
});

var webpackCache = {};

var webpackConfig = {
    context: path.resolve(__dirname, './client'),
    entry: ['./main'],
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: 'main.js'
    },
    module: {
        loaders: [
            {
                loader: 'babel-loader',
                include: [
                    path.resolve(__dirname, './client')
                ],
                query: {
                    plugins: ['lodash', ['transform-runtime', { polyfill: true }]],
                    presets: ['react', 'es2015']
                }
            }
        ]
    },
    resolve: {
        root: path.resolve(__dirname, './client')
    },
    devtool: 'source-map',
    cache: webpackCache
};

var webpackProductionConfig = _.assign({}, webpackConfig, {
    output: _.assign({}, webpackConfig.output, {
        filename: 'main.min.js'
    }),
    plugins: [
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.UglifyJsPlugin()
    ],
    devtool: undefined,
    cache: {}
});

gulp.task('js-dev', callback => {
    webpack(webpackConfig, (err, stats) => {
        if (err) {
            throw new Error('webpack: ' + (err.message || err));
        }
        callback();
    });
})

gulp.task('js-prod', callback => {
    webpack(webpackProductionConfig, (err, stats) => {
        if (err) {
            throw new Error('webpack: ' + (err.message || err));
        }
        callback();
    });
});

gulp.task('watch', ['eslint', 'js-dev'], () => {
    gulp.watch(['client/**/*.js'], ['eslint', 'js-dev']);
    gulp.watch(['server/**/*.js'], ['eslint']);
});

gulp.task('default', ['eslint', 'js-dev', 'js-prod'])
