var gulp = require('gulp');
var less = require('gulp-less');
var cleanCSS = require('gulp-clean-css');
var rename = require("gulp-rename");
var uglify = require('gulp-uglify');
var clean = require('gulp-clean');

var prodFolder = "prod/";
var cssFolder = prodFolder + "css/";
var jsFolder = prodFolder + "js/";

gulp.task('prod', ['css', 'js', 'copyBootstrap', 'copyHtml']);

gulp.task('css', function() {
    return gulp.src('src/less/paperCalc.less')
        .pipe(less())
        .pipe(cleanCSS({ compatibility: 'ie8' }))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest(cssFolder));
});

gulp.task('js', function () {
    return gulp.src(['src/js/paperCalc.js'])
        .pipe(uglify())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest(jsFolder));
});

gulp.task('copyBootstrap', function () {
    return gulp.src('node_modules/bootstrap/dist/css/bootstrap.min.css')
        .pipe(gulp.dest(cssFolder));
});

gulp.task('copyHtml', function () {
    return gulp.src('src/paperCalc.html')
        .pipe(gulp.dest(prodFolder));
});

gulp.task('clear', function () {
    return gulp.src(prodFolder, {read: false})
        .pipe(clean());
});