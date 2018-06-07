import gulp from 'gulp';
import del from 'del';
import runSequence from 'run-sequence';
import plumber from 'gulp-plumber';
import webpack from 'webpack';
import webpackStream from 'webpack-stream';
import webpackConfig from './webpack.config.js';
import pug from 'gulp-pug';
import stylus from 'gulp-stylus';
import autoPrefixer from 'gulp-autoprefixer';
import browserSync from 'browser-sync';

gulp.task('webpack', () => {
    return webpackStream(webpackConfig, webpack)
        .pipe(plumber())
        .pipe(gulp.dest('./public/js/'));
});

gulp.task('pug', () => {
    return gulp.src(['./src/pug/**/*.pug', '!./pug/**/_*.pug'])
        .pipe(pug({
            pretty: true
        }))
        .pipe(gulp.dest('./public/'));
});

gulp.task('stylus', () => {
    gulp.src('./src/stylus/**/*.styl')
        .pipe(stylus())
        .pipe(autoPrefixer({
            browsers: ['last 2 version', 'iOS >= 8.1', 'Android >= 4.4'],
            cascade: false
        }))
        .pipe(gulp.dest('./public/css/'));
});

gulp.task('browser-sync', () => {
    browserSync.init({
        server: {
            baseDir: "public",
            index: "./index.html"
        },
        open: false
    });
});

gulp.task('bs-reload', () => {
    browserSync.reload();
})

gulp.task('clean', () => {
    del(['./public/']);
});

gulp.task('process', (callback) => {
    return runSequence(
        ['webpack', 'pug', 'stylus'],
        'bs-reload',
        callback
    );
});
gulp.task('default', ['browser-sync','process'], () => {
    gulp.watch('./src/**/*.js', ['webpack']);
    gulp.watch('./src/**/*.pug', ['pug']);
    gulp.watch('./src/**/*.sylus', ['stylus']);
})