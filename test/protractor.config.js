var SpecReporter = require('jasmine-spec-reporter').SpecReporter;
exports.config = {
    framework: 'jasmine',
    seleniumAddress: 'http://localhost:4444/wd/hub',
    // seleniumAddress: './node_modules/webdriver-manager/selenium/selenium-server-standalone-3.141.59.jar',
    specs: ['../src/**/*.e2e.js'],
    // chromeDriver: '/usr/local/bin/chromedriver',

    capabilities: {
      browserName: 'chrome',
      'goog:chromeOptions': {
        w3c: false
      }
    },
  // maxInstances: 4,
  // shardTestFiles: true,
    // chromeOptions: {
      //your path to Chromium
      // binary: '/Applications/Chromium.app/Contents/MacOS/Chromium'
    // },
    // chromeDriver:'../node_modules/chromedriver/bin/chromedriver',

  onPrepare: function() {
      jasmine.getEnv().addReporter(new SpecReporter({
          spec: {
              displayStacktrace: true
          }
      }));
  }
};
