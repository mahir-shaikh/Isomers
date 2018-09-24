// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular/cli'],
    plugins: [
      require('karma-jasmine'),
      require('karma-phantomjs-launcher'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage-istanbul-reporter'),
      require('@angular/cli/plugins/karma')
    ],
    client:{
      clearContext: false // leave Jasmine Spec Runner output visible in browser
    },
    coverageIstanbulReporter: {
      reports: [ 'html', 'lcovonly' ],
      fixWebpackSourcePaths: true,
      thresholds: {
        statements: 80,
        lines: 80,
        branches: 70,
        functions: 80
      }
    },
    angularCli: {
      environment: 'dev'
    },
    files: [
      { pattern: './src/assets/js/jquery.js', watched: false },
      { pattern: './src/assets/js/jquery-3.1.1.slim.min.js', watched: false }],
    reporters: ['progress', 'kjhtml'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    //browsers: ['Chrome'],
    browsers: ['PhantomJS'],
    phantomjsLauncher: {
      // Have phantomjs exit if a ResourceError is encountered 
      // (useful if karma exits without killing phantom)
      exitOnResourceError: true // Could require proxy if tests access images without /base path
    },
    singleRun: false
  });
};
