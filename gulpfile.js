const gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    browserSync = require("browser-sync").create(),
    typescript = require('gulp-typescript'),
    rename = require("gulp-rename"),
    less = require('gulp-less'),
    cleanCSS = require('gulp-clean-css'),
    clean = require('gulp-clean'),
    revAppend = require('gulp-rev-append'),
    uncss = require('gulp-uncss');

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
    clean: './build',
    vendor: {
        bootstrap: "node_modules/bootstrap/dist/css/bootstrap.css"
    }
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
    'js',
    'css',
    'vendor',
    'html',
    'revAppend'
]);

gulp.task('watch', function(){
    gulp.watch([path.watch.html], function() {
        gulp.run('html');
    });
    gulp.watch([path.watch.less], function() {
        gulp.run('css');
    });
    gulp.watch([path.watch.ts], function() {
        gulp.run('js');
    });
});

gulp.task('html', ['js', 'css', 'vendor'], function () {
    return gulp.src(path.src.html)
        .pipe(gulp.dest(path.build.html))
        .pipe(browserSync.stream());
});

gulp.task('js', function () {
    return gulp.src(path.src.ts)
        .pipe(typescript())
        .pipe(uglify())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest(path.build.js))
        .pipe(browserSync.stream());
});

gulp.task('css', function () {
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

gulp.task('vendor', function () {
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

gulp.task('clean', function () {
    return gulp.src(path.clean, {read: false})
        .pipe(clean());
});

gulp.task('revAppend', ['css', 'js', 'vendor', 'html'], function() {
    gulp.src(path.build.html + '/paperCalc.html')
        .pipe(revAppend())
        .pipe(gulp.dest(path.build.html));
});