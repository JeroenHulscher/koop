describe('Input autocomplete', function () {

  beforeEach(function () {
    browser.waitForAngularEnabled(false);

  });

  it('should open autocomplete with typing', function () {
    browser.get('http://localhost:3000/components/preview/input-autocomplete--default');

    var input = element(by.css('.js-combobox'));
    var expander = element(by.css('.combobox-suggestions'));

    input.sendKeys('Vla');
    browser.driver.sleep(750);

    expect(expander.isDisplayed()).toBeTruthy();
  });

  it('should get result matching: Gemeente Vlaardingen', function () {
    var result = element(by.css('.js-suggestion'));

    expect(result.getText()).toEqual('Gemeente Vlaardingen');
  });

  it('should select "Gemeente Vlaardingen" when pushing TAB', function () {
    browser.actions().sendKeys(protractor.Key.TAB).perform();
    browser.driver.sleep(750);

    expect('Gemeente Vlaardingen').toEqual(browser.driver.switchTo().activeElement().getText());
  });

  it('should add "Gemeente Vlaardingen" as selected choice', function () {
    var input = element(by.css('.js-combobox'));

    browser.actions().sendKeys(protractor.Key.ENTER).perform();
    browser.driver.sleep(250);

    expect(input.getAttribute('value')).toEqual('Gemeente Vlaardingen');
  });

  it('should delete value when click on X', function () {
    var input = element(by.css('.js-combobox'));
    var result = element(by.css('.js-clear-button'));
    result.click();

    expect(input.getAttribute('value')).toEqual('');

  });

});
