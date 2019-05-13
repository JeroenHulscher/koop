describe('Sidebar sticky', function () {

  var path = require('path');

  beforeEach(function () {
    browser.waitForAngularEnabled(false);
  });

  it('open content when clicked on trigger', function () {
    browser.get('http://localhost:3000/components/preview/collapsible--default');

    var width = 1000;
    var height = 600;
    browser.driver.manage().window().setSize(width, height);

    var trigger = element(by.css('.collapsible__header a'));
    var content = element(by.css('.collapsible__content'));
    trigger.click();

    browser.driver.sleep(250);

    expect(content.isDisplayed()).toBeTruthy();
  });

  it('open content when clicked on trigger', function () {

    var trigger = element(by.css('.collapsible__header a'));
    var content = element(by.css('.collapsible__content'));
    trigger.click();

    browser.driver.sleep(250);

    expect(content.isDisplayed()).toBeFalsy();
  });

});
