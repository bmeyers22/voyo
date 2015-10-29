// Karma configuration
// Generated on Mon Oct 26 2015 17:38:37 GMT-0400 (EDT)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: [
      '../bower_components/jquery/dist/jquery.js',
      '../bower_components/angular/angular.js',
      '../bower_components/angular-animate/angular-animate.js',
      '../bower_components/angular-sanitize/angular-sanitize.js',
      '../bower_components/angular-ui-router/release/angular-ui-router.js',
      '../bower_components/firebase/firebase.js',
      '../bower_components/ng-messages/angular-messages.js',
      '../bower_components/caman/dist/caman.js',
      '../bower_components/caman/dist/caman.full.js',
      '../bower_components/ngCordova/dist/ng-cordova.js',
      '../bower_components/ion-affix/ion-affix.js',
      '../bower_components/angularfire/dist/angularfire.js',
      '../bower_components/angular-moment/angular-moment.js',
      '../bower_components/ng-lodash/build/ng-lodash.js',
      '../bower_components/ionic/js/ionic.js',
      '../bower_components/ionic/js/ionic-angular.js',
      '../bower_components/angular-mocks/angular-mocks.js',
      '../node_modules/karma-babel-preprocessor/node_modules/babel-core/browser-polyfill.js',
      '../app/app.js',
      '../app/controllers.js',
      '../app/router.js',
      '../app/services.js',
      '../app/**/*.js',
      '../app/**/*.html',
      'unit/**/*.js'
    ],


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      '../app/**/*.js': ['babel', 'coverage'],
      './**/*.js': ['babel']
    },

    babelPreprocessor: {
      options: {
        sourceMap: 'inline'
      },
      filename: function (file) {
        return file.originalPath.replace(/\.js$/, '.es5.js');
      },
      sourceFileName: function (file) {
        return file.originalPath;
      }
    },
    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress', 'coverage', 'coveralls'],

    coverageReporter: {
      reporters: [
        {
            type: 'html',
            dir: 'coverage',
            subdir: '.'
        },
        {
          type: 'lcov', // lcov or lcovonly are required for generating lcov.info files
          dir: 'coverage',
          subdir: '.'
        }
      ]
    },

    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultanous
    concurrency: Infinity
  })
}
