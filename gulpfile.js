var gulp = require("gulp");
var nodemon = require("gulp-nodemon");
var del = require('del');
var path = require('path');
var fs = require("fs");
var sourcemaps = require('gulp-sourcemaps');
var webpack = require('webpack-stream');
var sass = require('gulp-sass');
var concat = require("gulp-concat");
//var sassFiles = JSON.parse(fs.readFileSync("./src/client/scss/requiredSass.json")).files;
var runSequence = require('run-sequence');
var stripComments = require('gulp-strip-comments');
var uglify = require('gulp-uglify');
var gulpUtil = require('gulp-util');
const wbBuild = require('workbox-build');
var pump = require('pump');

gulp.task("default", function () {
    runSequence("clean:dist", ["build"], ["bundle-sw"], ["compress"], ["watch"], 'start_server');
});

gulp.task("watch", function () {
    return gulp.watch([
        "src/**/*.*"], 
       ["webpack"]
    );
});

gulp.task('compress', function (cb) {
  pump([
        gulp.src('dist/*.js'),
        uglify(),
        gulp.dest('dist')
    ],
    cb
  );
});

gulp.task("build", ["webpack"]);

gulp.task("webpack", function () {
    return webpack(require('./webpack.config.babel.js'))
		.on('error', function handleError() {
			this.emit('end');
		})
        .pipe(sourcemaps.write('dist/'))
        .pipe(gulp.dest('dist/'));
});

gulp.task("start_server", [], function () {
  nodemon({ script: "./bin/www" });
});

gulp.task('scss', function () {
    return gulp.src(sassFiles)
        .pipe(sass().on('error', sass.logError))
        .pipe(concat('app.css'))
        .pipe(gulp.dest("dist/"))
});

gulp.task('css_admin', function () {
    return gulp.src([
            "src/static_assets/css/*.css",
            "!src/static_assets/css/*.scss"
        ])
        .pipe(gulp.dest("dist/client/css/"))
});

gulp.task('image', function () {
    return gulp.src("src/client/images/**")
        .pipe(gulp.dest("dist/client/images/"))
});

gulp.task('angularJs', function () {
    return gulp.src("angular-repo/**")
        .pipe(gulp.dest("dist/client/js/"))
});

gulp.task('angularCSS', function () {
    return gulp.src("angular-repo/**")
        .pipe(gulp.dest("dist/client/css/"))
});

gulp.task('font', function () {
    return gulp.src("src/static_assets/fonts/**")
        .pipe(gulp.dest("dist/client/fonts/"))
});

gulp.task('bundle-sw', () => {
    return wbBuild.injectManifest({
      swSrc: 'public/clevertap_sw1.js',
      swDest: 'public/clevertap_sw.js',
      globDirectory: './',
      staticFileGlobs: [
        'dist/bundle.*.css',
        'dist/app.*.js',
        'dist/1.AboutPage.*.js',
        'dist/2.MemberPages.*.js',
        'dist/app.*.js',
        'dist/vendor*.js'
      ]
    })
    .catch((err) => {
      console.log('[ERROR] This happened: ' + err);
    });
});

gulp.task('clean:dist', function () {
    del.sync('public/clevertap_sw.js');
    return del.sync('dist');
});