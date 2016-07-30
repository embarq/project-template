'use strict';

var del = require('del'),
    gulp = require('gulp'),
    autoprefixer = require('gulp-autoprefixer'),
    browsersync = require('browser-sync'),
    concat = require('gulp-concat'),
    sass = require('gulp-sass'),
    bourbon = require('node-bourbon'),
    sourcemaps = require('gulp-sourcemaps'),
    reload = browsersync.reload;

var appRoot = './app',
    buildRoot = './build';

var dir = {
    html: '',
    js: '/js',
    scss: '/styles',
    mainScss: '/index.scss',
    css: '/css',
    images: '/images',
    fonts: '/fonts',
    libs: '/libs'
}

var appPaths = {
    html: appRoot + dir.html + '/*.html',
    js: appRoot + dir.js + '/*.js',
    scss: appRoot + dir.scss + '/**/*.scss',
    images: appRoot + dir.images + '/**/*.*',
    fonts: appRoot + dir.fonts + '/**/*.*',
    libs: appRoot + dir.libs + '/**/*.*',
    mainScss: appRoot + dir.mainScss
};

var buildPaths = {
    html: buildRoot + dir.html,
    js: buildRoot + dir.js,
    css: buildRoot + dir.css,
    images: buildRoot + dir.images,
    libs: buildRoot + dir.libs,
    fonts: buildRoot + dir.fonts
};

gulp.task('stylesheets', function() {
    return gulp.src(appPaths.mainScss)
        .pipe(sourcemaps.init())
        .pipe(sass({
            includePaths: bourbon.includePaths,
        })).on('error', sass.logError)
        .pipe(autoprefixer({
            browsers: ['last 3 versions']
        }))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(buildPaths.css))
        .pipe(reload({
            stream: true
        }));
});

gulp.task('js', function() {
    return gulp.src(appPaths.js)
        .pipe(sourcemaps.init())
        .pipe(concat('main.js'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(buildPaths.js))
        .pipe(reload({
            stream: true
        }));
});

gulp.task('libs', function() {
    return gulp.src(appPaths.libs)
        .pipe(gulp.dest(buildPaths.libs))
        .pipe(reload({
            stream: true
        }));
});

gulp.task('images', function() {
    gulp.src(appPaths.images)
        .pipe(gulp.dest(buildPaths.images))
});

gulp.task('html', function() {
    gulp.src(appPaths.html)
        .pipe(gulp.dest(buildPaths.html))
        .pipe(reload({
            stream: true
        }));
});

gulp.task('fonts', function() {
    gulp.src(appPaths.fonts)
        .pipe(gulp.dest(buildPaths.fonts))
        .pipe(reload({
            stream: true
        }));
});

gulp.task('server', function() {
    browsersync.init({
        server: {
            baseDir: buildRoot
        },
        port: 3000,
        notify: false,
        open: true
    });
});

gulp.task('clean', function() {
    del(buildRoot);
})

gulp.task('build', [
    'html',
    'js',
    'stylesheets',
    'fonts',
    'images',
    'libs'
]);

gulp.task('watch', function() {
    gulp.watch(appPaths.html, ['html']);
    gulp.watch(appPaths.scss, ['stylesheets']);
    gulp.watch(appPaths.js, ['js']);
    gulp.watch(appPaths.images, ['images']);
    gulp.watch(appPaths.fonts, ['fonts']);
    gulp.watch(appPaths.libs, ['libs']);
});

gulp.task('default', [
    'clean',
    'build',
    'server',
    'watch'
]);