var gulp = require('gulp');
var less = require('gulp-less');
var cleanCSS = require('gulp-clean-css');
var rename = require("gulp-rename");
var uglify = require('gulp-uglify');
var revAppend = require('gulp-rev-append');

gulp.task('dev', ['css', 'js', 'copyBootstrap', 'revAppend']);

var srcFolder = "src/";
var cssFolder = srcFolder + "css/";
var jsFolder = srcFolder + "js/";
var lessFolder = srcFolder + "less/";

var paths = {
    js: jsFolder + 'paperCalc.js',
    less: lessFolder + 'paperCalc.less'
};

gulp.task('watch', function() {
    gulp.watch(paths.less, ['css', 'revAppend']);
    gulp.watch(paths.js, ['js', 'revAppend']);
});

gulp.task('css', function() {
    return gulp.src(paths.less)
        .pipe(less())
        .pipe(cleanCSS({ compatibility: 'ie8' }))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest(cssFolder));
});

gulp.task('js', function () {
    return gulp.src(paths.js)
        .pipe(uglify())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest(jsFolder));
});

gulp.task('copyBootstrap', function () {
    return gulp.src('node_modules/bootstrap/dist/css/bootstrap.min.css')
        .pipe(gulp.dest(cssFolder));
});

gulp.task('revAppend', ['css', 'js'], function() {
    gulp.src(srcFolder + 'paperCalc.html')
        .pipe(revAppend())
        .pipe(gulp.dest(srcFolder));
});