import gulp from 'gulp';
import plumber from 'gulp-plumber';
import eslint from 'gulp-eslint';
import path from 'path';
import webpack from 'webpack';
import _ from 'lodash';
import less from 'gulp-less';
import concat from 'gulp-concat';
import cssnano from 'gulp-cssnano';
import rename from 'gulp-rename';
import addsrc from 'gulp-add-src';

gulp.task('eslint', () => {
    return gulp.src(['client/**/*.js', 'server/**/*.js'])
        .pipe(plumber())
        .pipe(eslint())
        .pipe(eslint.format());
});

var webpackCache = {};

var webpackConfig = {
    context: path.resolve(__dirname, './'),
    entry: './client/main',
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: 'main.js'
    },
    module: {
        loaders: [
            {
                loader: 'babel-loader',
                include: path.resolve(__dirname, './'),
                exclude: path.resolve(__dirname, './node_modules'),
                query: {
                    plugins: [
                        'lodash',
                        ['transform-runtime', { polyfill: true }]
                    ],
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
});

gulp.task('js-prod', callback => {
    webpack(webpackProductionConfig, (err, stats) => {
        if (err) {
            throw new Error('webpack: ' + (err.message || err));
        }
        callback();
    });
});

gulp.task('less', () => {
    gulp.src(['client/styles/**/*.less'])
        .pipe(less())
        .pipe(addsrc.prepend(['node_modules/react-select/dist/react-select.css']))
        .pipe(concat('app.css'))
        .pipe(gulp.dest('dist/'));
});
gulp.task('minify-css', ['less'], () => {
    gulp.src(['dist/app.css'])
        .pipe(cssnano())
        .pipe(rename('app.min.css'))
        .pipe(gulp.dest('dist/'));
});

gulp.task('watch', ['eslint', 'js-dev'], () => {
    gulp.watch(['client/**/*.js'], ['eslint', 'js-dev']);
    gulp.watch(['server/**/*.js'], ['eslint']);
    gulp.watch(['client/styles/**/*.less'], ['less']);
});

gulp.task('default', ['eslint', 'js-dev', 'js-prod', 'less', 'minify-css']);
