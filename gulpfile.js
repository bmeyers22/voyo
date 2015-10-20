var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var mainBowerFiles = require('gulp-main-bower-files');
var concat = require('gulp-concat');
var coffee = require('gulp-coffee');
var sourcemaps = require('gulp-sourcemaps');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var sh = require('shelljs');

var paths = {
  sass: ['./www/styles/**/*.scss'],
  coffee: ['./www/js/app/**/*.coffee'],
  html: ['./www/templates/**/*.html']
};

gulp.task('default', []);
gulp.task('build', [ 'clean-dist', 'sass', 'vendor-javascript', 'javascript']);

gulp.task('clean-dist', function() {
  return sh.rm('-r', './www/dist');
});

gulp.task('sass', function() {
  gulp.src('./scss/ionic.app.scss')
    .pipe(sass({
      errLogToConsole: true
    }))
    .pipe(gulp.dest('./www/dist/'))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('./www/dist/'))

  gulp.src('./www/styles/app.scss')
    .pipe(sass({
      errLogToConsole: true
    }))
    .pipe(concat('voyo.css'))
    .pipe(gulp.dest('./www/dist/'));

});

gulp.task('javascript', function(done) {
  return gulp.src('./www/js/app/**/*.coffee')
    .pipe(coffee({bare: true}).on('error', gutil.log))
    .pipe(sourcemaps.init())
    .pipe(concat('voyo.js'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./www/dist'));
});

gulp.task('vendor-javascript', function() {
  return gulp.src('./bower.json')
    .pipe(mainBowerFiles({ debugging: true }))
    .pipe(concat('vendor.js'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./www/dist'));
});

gulp.task('watch', function() {
  gulp.watch(paths.sass, ['sass']);
  gulp.watch(paths.coffee, ['javascript']);
  gulp.watch(paths.html);
});

gulp.task('install', ['git-check'], function() {
  return bower.commands.install()
    .on('log', function(data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});

gulp.task('git-check', function(done) {
  if (!sh.which('git')) {
    console.log(
      '  ' + gutil.colors.red('Git is not installed.'),
      '\n  Git, the version control system, is required to download Ionic.',
      '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
      '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
    );
    process.exit(1);
  }
  done();
});
