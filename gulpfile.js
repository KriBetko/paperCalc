"use strict";

const gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    browserSync = require("browser-sync").create(),
    typescript = require('gulp-typescript'),
    rename = require("gulp-rename"),
    less = require('gulp-less'),
    cleanCSS = require('gulp-clean-css'),
    clean = require('gulp-clean'),
    revAppend = require('gulp-rev-append'),
    uncss = require('gulp-uncss'),
    inlineCss = require('gulp-inline-css'),
    zip = require('gulp-zip');

const path = {
    build: {
        html: 'build/',
        js: 'build/js/',
        css: 'build/css/'
    },
    src: {
        html: 'src/paperCalc.html',
        ts: 'src/ts/*.ts',
        less: 'src/less/*.less'
    },
    watch: {
        html: 'src/**/*.html',
        ts: 'src/ts/**/*.ts',
        less: 'src/less/**/*.less'
    },
    clean: 'build/',
    vendor: {
        bootstrap: "node_modules/bootstrap/dist/css/bootstrap.css"
    },
    release: {
        main: 'release/',
        html: 'release/',
        js: 'release/js/'
    },
    zip: [
        'release/*'
    ]
};

const config = {
    server: {
        baseDir: "./build",
        index: "paperCalc.html"
    }
};

gulp.task('default', [
    'build',
    'webServer',
    'watch'
]);

gulp.task('build', [
    'js:build',
    'css:build',
    'vendor:build',
    'html:build',
    'revAppend:build'
]);

gulp.task('watch', function(){
    gulp.watch([path.watch.html], function() {
        gulp.run('html:build');
    });
    gulp.watch([path.watch.less], function() {
        gulp.run('css:build');
    });
    gulp.watch([path.watch.ts], function() {
        gulp.run('js:build');
    });
});

gulp.task('html:build', ['js:build', 'css:build', 'vendor:build'], function () {
    return gulp.src(path.src.html)
        .pipe(inlineCss())
        .pipe(gulp.dest(path.build.html))
        .pipe(browserSync.stream());
});

gulp.task('js:build', function () {
    return gulp.src(path.src.ts)
        .pipe(typescript())
        .pipe(uglify())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest(path.build.js))
        .pipe(browserSync.stream());
});

gulp.task('css:build', function () {
    return gulp.src(path.src.less)
        .pipe(less())
        .pipe(uncss({
            html: [path.src.html]
        }))
        .pipe(cleanCSS())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest(path.build.css))
        .pipe(browserSync.stream());
});

gulp.task('vendor:build', function () {
    return gulp.src(path.vendor.bootstrap)
        .pipe(uncss({
            html: [path.src.html]
        }))
        .pipe(cleanCSS())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest(path.build.css))
        .pipe(browserSync.stream());
});

gulp.task('webServer', ['build'], function () {
    return browserSync.init(config);
});

gulp.task('clean:build', function () {
    return gulp.src(path.clean, {read: false})
        .pipe(clean());
});

gulp.task('revAppend:build', ['css:build', 'js:build', 'vendor:build', 'html:build'], function() {
    gulp.src(path.build.html + '/paperCalc.html')
        .pipe(revAppend())
        .pipe(gulp.dest(path.build.html));
});

gulp.task('release', ['build'], function () {
    gulp.src(path.release.main).pipe(clean(), {read: false});
    gulp.src(path.build.html + 'paperCalc.html')
        .pipe(gulp.dest(path.release.html));
    gulp.src(path.build.js + 'paperCalc.min.js')
        .pipe(gulp.dest(path.release.js));
});

gulp.task('zip:release', function () {
    return gulp.src(path.zip)
        .pipe(zip('paperCalc.zip'))
        .pipe(gulp.dest(path.release.main));
});