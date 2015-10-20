var gulp = require('gulp'),
  gutil = require('gulp-util'),
  bower = require('bower'),
  debug = require('gulp-debug'),
  bowerFiles = require('main-bower-files'),
  concat = require('gulp-concat'),
  babel = require('gulp-babel'),
  sourcemaps = require('gulp-sourcemaps'),
  sass = require('gulp-sass'),
  minifyCss = require('gulp-minify-css'),
  rename = require('gulp-rename'),
  templateCache = require('gulp-angular-templatecache'),
  queue = require('streamqueue'),
  sh = require('shelljs');

var paths = {
  sass: ['styles/**/*.scss'],
  js: ['app/**/*.js'],
  html: ['app/**/*.html']
};

function fileTypeFilter (files, extension) {
  var regExp = new RegExp('\\.' + extension + '$');
  return files.filter(regExp.test.bind(regExp));
};


gulp.task('default', ['build']);
gulp.task('build', [ 'clean-dist', 'sass', 'vendor-javascript', 'javascript', 'templates', 'fonts']);

gulp.task('clean-dist', function() {
  return sh.rm('-r', 'www/dist');
});

gulp.task('sass', function() {
  gulp.src('vendor/scss/ionic.app.scss')
    .pipe(sass({
      errLogToConsole: true
    }))
    .pipe(gulp.dest('www/dist/'))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('www/dist/'))

  gulp.src('styles/app.scss')
    .pipe(sass({
      errLogToConsole: true
    }))
    .pipe(concat('voyo.css'))
    .pipe(gulp.dest('www/dist/'));

});

gulp.task('vendor-javascript', function() {
  var files = bowerFiles({paths: './', debugging: true}),
    vendorJs = fileTypeFilter(files, 'js'),
    q = new queue({objectMode: true});
    q.queue(gulp.src(vendorJs)
      .pipe(sourcemaps.init({loadMaps: true}))
      .pipe(concat('vendor.js'))
      .pipe(sourcemaps.write())
      .pipe(gulp.dest('./www/dist'))
    );
    return q.done();
});


gulp.task('javascript', function(done) {
  return gulp.src([
      'app/app.js',
      'app/router.js',
      'app/controllers.js',
      'app/services.js',
      'app/templates.js',
      'app/**/*.js'
    ])
    .pipe(babel())
    .pipe(sourcemaps.init())
    .pipe(concat('voyo.js'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('www/dist'));
});

// gulp.task('templates', function () {
//   return gulp.src('app/**/*.html')
//     .pipe(debug({title: 'templates'}))
//     .pipe(htmlmin({ collapseWhitespace: true }))
//     .pipe(ngHtml2Js({ moduleName: 'templates' }))
//     .pipe(concat('templates.js'))
//     .pipe(ngAnnotate())
//     .pipe(gulp.dest('./www/dist/'));
// });
gulp.task('templates', function () {
  return gulp.src('app/**/*.html')
    .pipe(templateCache())
    .pipe(gulp.dest('www/dist'));
});

gulp.task('fonts', function () {
  return gulp.src([
    './bower_components/ionic/fonts/**/*.{ttf,woff,eot,svg}',
  ])
  .pipe(debug({title: 'fonts'}))
  .pipe(gulp.dest('./www/assets/fonts'));
});

gulp.task('watch', function() {
  gulp.watch('app/**/*', ['build']);
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
