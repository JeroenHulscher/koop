describe('Input autocomplete', function () {

  beforeEach(function () {
    browser.waitForAngularEnabled(false);
    browser.ignoreSynchronization = true;
  });

  // xit('should open autocomplete with typing', function () {
  //   browser.get('http://localhost:3000/components/preview/input-autocomplete--default');

  //   var input = element(by.css('.js-combobox'));
  //   var expander = element(by.css('.combobox-suggestions'));

  //   input.sendKeys('Vla');
  //   browser.driver.sleep(750);

  //   expect(expander.isDisplayed()).toBeTruthy();
  // });

  // xit('should get result matching: Gemeente Vlaardingen', function () {
  //   var result = element(by.css('.js-suggestion'));

  //   expect(result.getText()).toEqual('Gemeente Vlaardingen');
  // });

  // xit('should select "Gemeente Vlaardingen" when pushing TAB', function () {
  //   var input = element(by.css('.js-combobox'));
  //   input.sendKeys(protractor.Key.TAB);
  //   browser.driver.sleep(750);

  //   expect('Gemeente Vlaardingen').toEqual(browser.driver.switchTo().activeElement().getText());
  // });

  // xit('should add "Gemeente Vlaardingen" as selected choice', function () {
  //   var input = element(by.css('.js-combobox'));
  //   var body = element(by.css('body'));
  //   body.sendKeys(protractor.Key.RETURN);
  //   browser.driver.sleep(250);

  //   expect(input.getAttribute('value')).toEqual('Gemeente Vlaardingen');
  // });

  // xit('should delete value when click on X', function () {
  //   var input = element(by.css('.js-combobox'));
  //   var result = element(by.css('.js-clear-button'));
  //   result.click();

  //   expect(input.getAttribute('value')).toEqual('');

  // });

});
