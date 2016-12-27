var gulp = require('gulp');
var less = require('gulp-less');
var cleanCSS = require('gulp-clean-css');
var rename = require("gulp-rename");
var uglify = require('gulp-uglify');
var revAppend = require('gulp-rev-append');
var typescript = require('gulp-typescript');

gulp.task('dev', ['css', 'js', 'copyBootstrap', 'revAppend']);

var srcFolder = "src/";
var cssFolder = srcFolder + "css/";
var jsFolder = srcFolder + "js/";
var lessFolder = srcFolder + "less/";

var paths = {
    ts: jsFolder + 'paperCalc.ts',
    less: lessFolder + 'paperCalc.less'
};

gulp.task('watch', function() {
    gulp.watch(paths.less, ['css', 'revAppend']);
    gulp.watch(paths.ts, ['js', 'revAppend']);
});

gulp.task('css', function() {
    return gulp.src(paths.less)
        .pipe(less())
        .pipe(cleanCSS({ compatibility: 'ie8' }))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest(cssFolder));
});

gulp.task('js', function () {
    return gulp.src(paths.ts)
        .pipe(typescript({
            noImplicitAny: true
        }))
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