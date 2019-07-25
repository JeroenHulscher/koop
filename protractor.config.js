var SpecReporter = require('jasmine-spec-reporter').SpecReporter;
exports.config = {
    framework: 'jasmine',
    seleniumAddress: 'http://localhost:4444/wd/hub',
    // seleniumAddress: './node_modules/webdriver-manager/selenium/selenium-server-standalone-3.141.59.jar',
    specs: ['src/**/*.e2e.js'],
    // chromeDriver: './node_modules/protractor/node_modules/webdriver-manager/selenium/chromedriver',

    onPrepare: function() {
        jasmine.getEnv().addReporter(new SpecReporter({
            spec: {
                displayStacktrace: true
            }
        }));
    }
}
