describe('Datepicker', function() {
  beforeEach(function() {
    browser.waitForAngularEnabled(false);
  });

  fit('opens when clicking the datepicker button', function() {
    var datepickerButton;
    var datepicker;

    browser.get('http://localhost:3000/components/preview/datepicker');
    browser.sleep(100);

    datepickerButton = element(by.css('.ui-datepicker-trigger'));
    datepickerButton.click();

    datepicker = element(by.css('#ui-datepicker-div'));
    expect(datepicker.isDisplayed()).toBeTruthy();
  });

  fit('closes when clicking the datepicker button while it is currently open', function() {
    var datepicker;
    var datepickerButton;

    // Ensure the datepicker is currently open.
    datepicker = element(by.css('#ui-datepicker-div'));
    expect(datepicker.isDisplayed()).toBeTruthy();

    datepickerButton = element(by.css('.ui-datepicker-trigger'));
    datepickerButton.click();
    browser.sleep(1050);

    expect(datepicker.isDisplayed()).toBeFalsy();
  });

  fit('opens when clicking/focussing on the text input bar', function() {
    var datepickerInput = element(by.css('.datepicker__input'));
    var datepicker;

    datepickerInput.click();

    datepicker = element(by.css('#ui-datepicker-div'));

    expect(datepicker.isDisplayed()).toBeTruthy();
  });

  fit('closes when pressing escape', function() {
    var datepicker = element(by.css('#ui-datepicker-div'));

    // Ensure the datepicker is currently open.
    expect(datepicker.isDisplayed()).toBeTruthy();
    // Ensure the focus is on the datepicker.
    datepicker.click();

    browser.actions().sendKeys(protractor.Key.ESCAPE);
    browser.sleep(500);

    expect(datepicker.isDisplayed()).toBeFalsy();
  });
});
