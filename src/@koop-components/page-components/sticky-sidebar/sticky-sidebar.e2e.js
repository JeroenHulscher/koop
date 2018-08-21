describe('Input - file', function () {

  var path = require('path');

  beforeEach(function () {
    browser.waitForAngularEnabled(false);
  });

  fit('should show sidebar-trigger button when viewport mobile', function () {
    browser.get('http://localhost:3000/components/preview/sticky-sidebar');

    var width = 1000;
    var height = 600;
    browser.driver.manage().window().setSize(width, height);

    browser.driver.sleep(750);

    var width = 400;
    var height = 600;
    browser.driver.manage().window().setSize(width, height);

    browser.driver.sleep(750);

    var input = element(by.css('[data-toggle-open="Open sidebar"]'));

    expect( input.isDisplayed() ).toBeTruthy();
  });

  fit('should show sidebar when click on trigger', function () {
    var input = element(by.css('[data-toggle-open="Open sidebar"]'));
    input.click();

    var sidebarContainer = element(by.css(' .columns--sticky-sidebar__sidebar > div '));

    expect(sidebarContainer.isDisplayed()).toBeTruthy();
  });

  fit('should close sidebar when click on trigger', function () {
    var input = element(by.css('[data-toggle-open="Open sidebar"]'));
    input.click();

    var sidebarContainer = element(by.css(' .columns--sticky-sidebar__sidebar > div '));

    expect(sidebarContainer.isDisplayed()).toBeFalsy();
  });


});
