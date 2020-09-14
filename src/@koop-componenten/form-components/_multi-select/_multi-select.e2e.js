describe('Multi-select', function () {

  beforeEach(function () {
    browser.waitForAngularEnabled(false);
  });

  // xit('should open autocomplete with typing', function () {
  //   browser.get('http://localhost:3000/components/preview/multi-select');

  //   var input = element(by.css('.multiselect__controls input'));
  //   var expander = element(by.css('.multiselect__resultscontainer'));

  //   input.sendKeys('vol');
  //   browser.driver.sleep(750);

  //   expect(expander.isDisplayed()).toBeTruthy();
  // });

  // xit('should get result matching VOL', function () {
  //   var result = element(by.css('.multiselect__result'));

  //   expect(result.getText()).toEqual('Volvo');
  // });

  // xit('should select VOLVO when pushing TAB', function () {

  //   browser.actions().sendKeys(protractor.Key.TAB).perform();
  //   browser.driver.sleep(750);

  //   expect('Volvo').toEqual(browser.driver.switchTo().activeElement().getText());
  // });

  // xit('should add Volvo has selected choice', function () {
  //   browser.get('http://localhost:3000/components/preview/multi-select');

  //   var input = element(by.css('.multiselect__controls input'));

  //   input.sendKeys('Volvo');

  //   browser.actions().sendKeys(protractor.Key.TAB).perform();
  //   browser.driver.sleep(250);
  //   browser.actions().sendKeys(protractor.Key.ENTER).perform();
  //   browser.driver.sleep(250);

  //   var selectedContainer = element(by.css('.multiselect__controls'));
  //   var result = selectedContainer.element(by.css('.multiselect__choice'));

  //   expect(result.getAttribute('data-text')).toEqual('Volvo');
  // });

  // xit('should delete choice Volvo when removed', function () {
  //   var result = element(by.css('.multiselect__choice button'));
  //   result.click();

  //   expect(result.isPresent().toBeFalsy);

  // });
  // xit('should hide resultlist when ESC', function () {
  //   browser.get('http://localhost:3000/components/preview/multi-select');

  //   var input = element(by.css('.multiselect__controls input'));

  //   input.sendKeys('Volvo');

  //   browser.actions().sendKeys(protractor.Key.ESCAPE).perform();
  //   browser.driver.sleep(250);

  //   var selectedContainer = element(by.css('.multiselect__controls'));

  //   expect( selectedContainer.isPresent().toBeFalsy() );
  // });


});
