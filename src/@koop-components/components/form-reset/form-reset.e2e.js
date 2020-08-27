describe('Form reset', function () {

  beforeEach(function () {
    browser.waitForAngularEnabled(false);
  });

  fit('should reset the text-field', function () {
    browser.get('http://localhost:3000/components/preview/form-reset');

    var width = 1200;
    var height = 800;

    browser.driver.manage().window().setSize(width, height);

    browser.driver.sleep(500);

    var buttonReset = element(by.css('.formreset-resetlink'));
    buttonReset.click();

    var fieldSearch = element(by.css('#input-text-1'));

    browser.driver.sleep(500);

    expect(fieldSearch.getText()).toEqual('');
  });


});
