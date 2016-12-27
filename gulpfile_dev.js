var gulp = require('gulp');
var less = require('gulp-less');
var cleanCSS = require('gulp-clean-css');
var rename = require("gulp-rename");
var uglify = require('gulp-uglify');

gulp.task('dev', ['minify-css', 'minify-js', 'copyBootstrap']);

var srcFolder = "src/";
var cssFolder = srcFolder + "css/";
var jsFolder = srcFolder + "js/";

gulp.task('minify-css', function() {
    return gulp.src(cssFolder + 'paperCalc.css')
        .pipe(less())
        .pipe(cleanCSS({ compatibility: 'ie8' }))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest(cssFolder));
});

gulp.task('minify-js', function () {
    return gulp.src(jsFolder + 'paperCalc.js')
        .pipe(uglify())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest(jsFolder));
});

gulp.task('copyBootstrap', function () {
    return gulp.src('node_modules/bootstrap/dist/css/bootstrap.min.css')
        .pipe(gulp.dest(cssFolder));
});