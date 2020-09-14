// <input type="date" value="2015-02-14" data-date="14-02-2015" class="datepicker__input" data-date-format="DD-MM-YYYY" data-decorator="init-datepicker"

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
    datepickerInput.clear().then(function () {
      datepickerInput.sendKeys('10-10-2010');
    });

    // browser.sleep(7750);
    // Move the focus to the datepicker button and press space.
    // browser.actions().sendKeys(protractor.Key.TAB).perform();
    // browser.actions().sendKeys(protractor.Key.SPACE).perform();
    element(by.css('.ui-datepicker-trigger')).click();
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
      browser.sleep(2750);
      expect('oktober').toEqual(text);

      month.click();

      // Press TAB four times to end up inside the calendar again.
      // for(var i = 0; i < 4; i++) {
      //   browser.actions().sendKeys(protractor.Key.TAB).perform();
      //   browser.sleep(200);
      // }

      // console.log('protractor', protractor.Key);
      // browser.actions().sendKeys(protractor.Key.ARROW_UP).perform();
      // browser.actions().sendKeys(protractor.Key.ARROW_UP).perform();
      // browser.sleep(2200);

      // element(by.css('.ui-datepicker-month')).getText().then(function(newText) {
      //   expect('oktober').toEqual(newText);
      // })
    });
  });

  xit('closes when pressing escape after navigating using the keyboard', function() {
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
  */

  it('[RANGE] select the 13th, when clicked on the day', function () {
    var datepickerButton;
    var datepickerField;

    browser.get('http://localhost:3000/components/preview/datepicker--range');
    browser.sleep(1000);

    datepickerField = element(by.css('#input--1'));

    datepickerButton = element(by.css('#input--1 + .ui-datepicker-trigger'));
    datepickerButton.click();

    var days = element.all(by.css('.ui-state-default'));
    days.filter(function (elem) {
      return elem.getText().then(function (text) {
        return text === '15';
      });
    }).click();

    browser.sleep(1400);


    expect(datepickerField.getAttribute('value')).toEqual('15-02-2015');
  });

  it('[RANGE] open second datepicker and the 12th is NOT clickable', function () {
    var datepickerButton;
    var datepickerField;

    datepickerField = element(by.css('#input--2'));

    datepickerButton = element(by.css('#input--2 + .ui-datepicker-trigger'));
    datepickerButton.click();

    var days = element.all(by.css('.ui-state-default'));

    days.filter(function (elem) {
      return elem.getText().then(function (text) {
        return text === '12';
      });
    }).click();

    browser.sleep(400);

    browser.actions().sendKeys(protractor.Key.ESCAPE).perform();
    expect(datepickerField.getAttribute('value')).toEqual('15-02-2015');
  });

  it('[RANGE] open second datepicker and selects the 18th', function () {
    var datepickerButton;
    var datepickerField;

    datepickerField = element(by.css('#input--2'));

    var days = element.all(by.css('.ui-state-default'));
    days.filter(function (elem) {
      return elem.getText().then(function (text) {
        return text === '18';
      });
    }).click();

    browser.sleep(400);

    browser.actions().sendKeys(protractor.Key.ESCAPE).perform();

    expect(datepickerField.getAttribute('value')).toEqual('18-02-2015');
  });

});
