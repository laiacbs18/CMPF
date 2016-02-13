const gulp = require('gulp');
const del = require('del');
const typescript = require('gulp-typescript');
const tscConfig = require('./tsconfig.json');
var less = require('gulp-less');

// clean the contents of the distribution directory
gulp.task('clean', function () {
    return del('public/**/*');
});

// copy static assets - i.e. non TypeScript compiled source
gulp.task('copy:assets', ['clean'], function() {
    return gulp.src(['src/**/*', '!src/**/*.less', '!src/**/*.ts', '!src/**/*.js'])
        .pipe(gulp.dest('public'))
});

// copy dependencies
gulp.task('copy:libs', ['clean'], function() {
    return gulp.src([
            'node_modules/es6-shim/es6-shim.min.js',
            'node_modules/systemjs/dist/system-polyfills.js',
            'node_modules/angular2/bundles/angular2-polyfills.js',
            'node_modules/systemjs/dist/system.src.js',
            'node_modules/rxjs/bundles/Rx.js',
            'node_modules/angular2/bundles/angular2.dev.js',
            'node_modules/angular2/bundles/router.dev.js'
        ],{ base : './node_modules' })
        .pipe(gulp.dest('public/node_modules'))
});

// TypeScript compile
gulp.task('compile', ['clean'], function () {
    return gulp
        .src('src/**/*.ts')
        .pipe(typescript(tscConfig.compilerOptions))
        .pipe(gulp.dest('public'));
});

gulp.task('less', ['clean'],  function () {
    return gulp.src('src/**/*.less')
        .pipe(less())
        .pipe(gulp.dest('public'));
});

gulp.task('build', ['compile', 'less', 'copy:libs', 'copy:assets']);
gulp.task('default', ['build']);