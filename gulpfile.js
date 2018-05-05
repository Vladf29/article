'use strict'

const gulp = require('gulp');
const sass = require('gulp-sass');
const rename = require('gulp-rename');

const browserify = require('browserify');
const glob = require('glob');
const source = require('vinyl-source-stream');

const babelify = require('babelify');
const es = require('event-stream');
const browserSync = require('browser-sync').create();

const pug = require('gulp-pug');
const rimraf = require('rimraf');

const srcPaths = {
    pug: './views',
    js: './things/js',
    sass: './things/sass'
}

const uploadFolder = {
    g: './build',
    s: './public'
};

const uploadFiles = {
    js: {
        g: uploadFolder.g + '/js',
        s: uploadFolder.s + '/js'
    },
    sass: {
        g: uploadFolder.g + '/styles',
        s: uploadFolder.s + '/styles'
    },
    pug: {
        g: uploadFolder.g
    }
}


gulp.task('server', () => {
    browserSync.init({
        server: {
            proxy: "localhost:8000",
            baseDir: uploadFolder.g
        }
    });
    gulp.watch(uploadFolder.g + '/**/*').on('change', browserSync.reload);
});

gulp.task('js', (done) => {
    glob(`${srcPaths.js}/*.js`, (err, files) => {
        if (err) {
            done(err);
        } else {
            const tasks = files.map(entry => {
                const b = browserify({
                        entries: [entry],
                        debug: true
                    })
                    .transform(babelify.configure({
                        presets: ['es2015']
                    }))
                    .bundle()
                    .pipe(source(entry.split('/')[entry.split('/').length - 1]))
                    .pipe(gulp.dest(uploadFiles.js.g))
                    .pipe(gulp.dest(uploadFiles.js.s));
                return b;
            });
            es.merge(tasks).on('end', done);
        }
    });
});

gulp.task('pug', () => {
    return gulp.src(srcPaths.pug + '/pages/**/*.pug')
        .pipe(pug({
            pretty: true
        }))
        .pipe(gulp.dest(uploadFiles.pug.g));
});

gulp.task('sass', () => {
    return gulp.src(srcPaths.sass + '/*.scss')
        .pipe(sass()).on('error', sass.logError)
        .pipe(gulp.dest(uploadFiles.sass.g))
        .pipe(gulp.dest(uploadFiles.sass.s))
});

gulp.task('watchG', () => {
    gulp.watch(srcPaths.pug + '/**/*.pug', gulp.series('pug'));
});

gulp.task('wathcS', () => {
    gulp.watch(srcPaths.js + '/**/*.js', gulp.series('js'));
    gulp.watch(srcPaths.sass + '/**/*.scss', gulp.series('sass'));
});

gulp.task('cleanB', function del(cd) {
    return rimraf('build', cd);
});

gulp.task('cleanP', function del(cd) {
    return rimraf('public', cd);
});

gulp.task('clean', gulp.series('cleanB', 'cleanP'));

gulp.task('srv', gulp.series(
    'clean',
    gulp.parallel('js', 'sass'),
    gulp.parallel('wathcS')
));

gulp.task('default', gulp.series(
    'clean',
    gulp.parallel('js', 'pug', 'sass'),
    gulp.parallel('watchG', 'wathcS', 'server')
));