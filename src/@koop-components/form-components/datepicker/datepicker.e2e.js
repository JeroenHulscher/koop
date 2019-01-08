describe('Datepicker', function() {
  beforeEach(function() {
    browser.waitForAngularEnabled(false);
  });

  it('opens when clicking the datepicker button', function() {
    var datepickerButton;
    var datepicker;

    browser.get('http://localhost:3000/components/preview/datepicker');
    browser.sleep(100);

    datepickerButton = element(by.css('.ui-datepicker-trigger'));
    datepickerButton.click();

    datepicker = element(by.css('#ui-datepicker-div'));
    expect(datepicker.isDisplayed()).toBeTruthy();
  });

  it('closes when clicking the datepicker button while it is currently open', function() {
    var datepicker;
    var datepickerButton;

    // Ensure the datepicker is currently open.
    datepicker = element(by.css('#ui-datepicker-div'));
    expect(datepicker.isDisplayed()).toBeTruthy();

    datepickerButton = element(by.css('.ui-datepicker-trigger'));
    datepickerButton.click();
    browser.sleep(500);

    expect(datepicker.isDisplayed()).toBeFalsy();
  });
/*
  xit('allows you to type in a date and opens using the keyboard on the datepicker button', function() {
    var datepickerInput;
    var datepicker;

    datepickerInput = element(by.css('.datepicker__input'));
    datepickerInput.click();
    datepickerInput.sendKeys('10-10-2010');

    // Move the focus to the datepicker button and press space.
    browser.actions().sendKeys(protractor.Key.TAB).perform();
    browser.actions().sendKeys(protractor.Key.SPACE).perform();
    browser.sleep(750);

    datepicker = element(by.css('#ui-datepicker-div'));
    expect(datepicker.isDisplayed()).toBeTruthy();

    expect('10').toEqual(browser.driver.switchTo().activeElement().getText());
  });

  xit('allows you to switch months using the arrow keys', function() {
    var datepicker;
    var month;

    datepicker = element(by.css('#ui-datepicker-div'));
    expect(datepicker.isDisplayed()).toBeTruthy();

    month = element(by.css('.ui-datepicker-month'));
    month.getText().then(function(text) {
      expect('oktober').toEqual(text);

      month.click();

      // Press TAB four times to end up inside the calendar again.
      for(var i = 0; i < 4; i++) {
        browser.actions().sendKeys(protractor.Key.TAB).perform();
        browser.sleep(200);
      }

      browser.actions().sendKeys(protractor.Key.ARROW_UP).perform();
      browser.sleep(200);

      element(by.css('.ui-datepicker-month')).getText().then(function(newText) {
        expect('september').toEqual(newText);
      })
    });
  });
*/
  it('closes when pressing escape after navigating using the keyboard', function() {
    var datepicker;
    var month;

    // Ensure the datepicker is currently open.
    datepicker = element(by.css('#ui-datepicker-div'));
    expect(datepicker.isDisplayed()).toBeTruthy();

    month = element(by.css('.ui-datepicker-month'));
    month.click();

    browser.actions().sendKeys(protractor.Key.TAB).perform();
    browser.actions().sendKeys(protractor.Key.ARROW_UP).perform();
    browser.sleep(200);
    browser.actions().sendKeys(protractor.Key.ESCAPE).perform();
    browser.actions().sendKeys(protractor.Key.ESCAPE).perform();

    expect(datepicker.isDisplayed()).toBeFalsy();
  });
});
