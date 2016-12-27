var gulp = require('gulp');
var less = require('gulp-less');
var cleanCSS = require('gulp-clean-css');
var rename = require("gulp-rename");
var uglify = require('gulp-uglify');
var clean = require('gulp-clean');
var uncss = require('gulp-uncss');
var revAppend = require('gulp-rev-append');
var zip = require('gulp-zip');
var typescript = require('gulp-typescript');

var prodFolder = "prod/";
var cssFolder = prodFolder + "css/";
var jsFolder = prodFolder + "js/";

gulp.task('prod', ['css', 'js', 'copyBootstrap', 'copyHtml', 'revAppend', 'zip']);

gulp.task('css', function() {
    return gulp.src('src/less/paperCalc.less')
        .pipe(less())
        .pipe(uncss({
            html: ['src/paperCalc.html']
        }))
        .pipe(cleanCSS({ compatibility: 'ie8' }))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest(cssFolder));
});

gulp.task('js', function () {
    return gulp.src(['src/js/paperCalc.ts'])
        .pipe(typescript({
            noImplicitAny: true
        }))
        .pipe(uglify())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest(jsFolder));
});

gulp.task('copyBootstrap', function () {
    return gulp.src('node_modules/bootstrap/dist/css/bootstrap.min.css')
        .pipe(uncss({
            html: ['src/paperCalc.html']
        }))
        .pipe(gulp.dest(cssFolder));
});

gulp.task('copyHtml', function () {
    return gulp.src('src/paperCalc.html')
        .pipe(gulp.dest(prodFolder));
});

gulp.task('revAppend', ['copyHtml', 'css', 'js', 'copyBootstrap'], function() {
    gulp.src(prodFolder + 'paperCalc.html')
        .pipe(revAppend())
        .pipe(gulp.dest(prodFolder));
});

gulp.task('zip', ['css', 'js', 'copyBootstrap', 'copyHtml', 'revAppend'], function() {
    return gulp.src(prodFolder + '**')
        .pipe(zip('paperCalc.zip'))
        .pipe(gulp.dest('release'));
});

gulp.task('clear', function () {
    return gulp.src(prodFolder, {read: false})
        .pipe(clean());
});