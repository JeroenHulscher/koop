describe('Run components', function () {

  beforeEach(function () {
    browser.waitForAngularEnabled(false);
  });

  it('should render new components in the init state.', function () {
    browser.get('http://localhost:3000/components/preview/run-components');

    var width = 1200;
    var height = 800;

    browser.driver.manage().window().setSize(width, height);

    browser.driver.sleep(500);

    var button = element(by.css('#btn'));
    button.click();

    browser.driver.sleep(500);

    var collapseContent = element(by.css('.collapsible__content'));

    browser.driver.sleep(500);

    expect(collapseContent.isDisplayed()).toBeFalsy();
  });


});
