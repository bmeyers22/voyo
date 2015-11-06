require('dotenv').load();

var gulp = require('gulp'),
  gutil = require('gulp-util'),
  bower = require('bower'),
  debug = require('gulp-debug'),
  bowerFiles = require('main-bower-files'),
  concat = require('gulp-concat'),
  babel = require('gulp-babel'),
  replace = require('gulp-replace'),
  sourcemaps = require('gulp-sourcemaps'),
  htmlmin = require('gulp-htmlmin'),
  sass = require('gulp-sass'),
  autoprefixer = require('gulp-autoprefixer'),
  minifyCss = require('gulp-minify-css'),
  rename = require('gulp-rename'),
  templateCache = require('gulp-angular-templatecache'),
  queue = require('streamqueue'),
  sh = require('shelljs'),
  Server = require('karma').Server,
  coveralls = require('gulp-coveralls');

var paths = {
  sass: ['app/styles/**/*.scss'],
  js: ['app/**/*.js'],
  vendor: {
    js: 'vendor/javascript/*.js'
  },
  html: ['app/**/*.html'],
  index: ['app/index.html'],
  fonts: ['./bower_components/ionic/fonts/**/*.{ttf,woff,eot,svg}', 'app/fonts/*.{ttf,woff,eot,svg}']
};

function fileTypeFilter (files, extension) {
  var regExp = new RegExp('\\.' + extension + '$');
  return files.filter(regExp.test.bind(regExp));
};


gulp.task('default', ['build']);
gulp.task('build', [ 'clean-dist', 'index', 'sass', 'vendor-javascript', 'javascript', 'templates', 'fonts', 'images']);

gulp.task('clean-dist', function() {
  return sh.rm('-r', 'www/dist');
});

gulp.task('index', function() {
  return gulp.src('app/index.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('www'))
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

  gulp.src('app/styles/app.scss')
    .pipe(sass({
      errLogToConsole: true
    }))
    .pipe(concat('voyo.css'))
    .pipe(autoprefixer({
      browsers: ['last 2 versions']
    }))
    .pipe(gulp.dest('www/dist/'));

});

gulp.task('vendor-javascript', function() {
  var files = bowerFiles({paths: './', debugging: true}),
    vendorJs = fileTypeFilter(files, 'js'),
    q = new queue({objectMode: true});
    q.queue(gulp.src(vendorJs.concat(paths.vendor.js))
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
    .pipe(replace(/AWS_ACCESS_KEY/g, process.env.VOYO_AWS_ACCESS_KEY))
    .pipe(replace(/AWS_SECRET/g, process.env.VOYO_AWS_SECRET))
    .pipe(babel())
    .pipe(sourcemaps.init())
    .pipe(concat('voyo.js'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('www/dist'));
});

gulp.task('templates', function () {
  return gulp.src('app/**/*.html')
    .pipe(templateCache())
    .pipe(gulp.dest('www/dist'));
});

gulp.task('fonts', function () {
  return gulp.src(paths.fonts)
    .pipe(debug({title: 'fonts'}))
    .pipe(gulp.dest('./www/assets/fonts'));
});

gulp.task('images', function () {
  return gulp.src([
    './app/images/*',
  ])
  .pipe(debug({title: 'images'}))
  .pipe(gulp.dest('./www/assets/img'));
});

gulp.task('watch', function() {
  gulp.watch(paths.sass, ['sass']);
  gulp.watch(paths.js, ['javascript']);
  gulp.watch(paths.html, ['templates']);
  gulp.watch(paths.index, ['index']);
});

gulp.task('install', ['git-check'], function() {
  return bower.commands.install()
    .on('log', function(data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});

gulp.task('test', function (done) {
  new Server({
    configFile: __dirname + '/test/karma.conf.js',
    singleRun: gutil.env.watch ? false : true
  }, done).start();
  gulp.src('test/coverage/**/lcov.info')
  .pipe(coveralls());
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
