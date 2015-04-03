module.exports = function(config) {
  config.set({
    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: __dirname,

    // frameworks to use
    frameworks: ['mocha'],

    // list of files / patterns to load in the browser
    files: [
      'src/**/__tests__/*.js'
    ],

    // list of files to exclude
    exclude: [
    ],

    // preprocess matching files before serving them to the browser
    preprocessors: {
      'src/**/__tests__/*.js': ['webpack', 'sourcemap']
    },

    webpack: {
      devtool: 'inline-source-map',

      module: {
        loaders: [
          {test: /\.js$/, loader: 'babel-loader?stage=0'}
        ]
      }
    },

    plugins: [
      require('karma-firefox-launcher'),
      require('karma-sourcemap-loader'),
      require('karma-mocha'),
      require('karma-webpack')
    ],

    // test results reporter to use
    reporters: ['dots'],

    // web server port
    port: 9876,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // level of logging
    logLevel: config.LOG_INFO,

    // start these browsers
    browsers: ['Firefox'],

    // make it work on Travis CI; based on:
    // <https://github.com/rackt/react-router/blob/master/karma.conf.js>
    browserNoActivityTimeout: 90000,
    singleRun: process.env.CONTINUOUS_INTEGRATION === 'true'
  });
};
