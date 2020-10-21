describe('Un-select all', function () {
  beforeEach(function () {
    browser.waitForAngularEnabled(false);
    browser.manage().logs()
      .get('browser').then(function (browserLog) {
        console.log('log: ' +
          require('util').inspect(browserLog));
      });
  });

  fit('un-selects the mastercheckbox when checking a different checkbox', function () {
    var masterCheckbox;

    browser.get('http://localhost:3000/components/preview/checkbox-unselectall');
    browser.sleep(100);

    var allCheckboxes = element.all(by.css('.checkbox__label'));
    allCheckboxes.each(function (element, index) {
      if (index === 3) {
        element.click();
      }
    });

    masterCheckbox = element(by.css('.js-checkbox-master ~ .checkbox__label'));
    expect(masterCheckbox.isSelected()).toBe(false);

  });

  fit('un-selects all checkboxes when selecting the master (unselect-all) checkbox', function () {
    var masterCheckbox;

    masterCheckbox = element(by.css('.js-checkbox-master ~ .checkbox__label'));
    masterCheckbox.click();

    var loop = element.all(by.css('.checkbox__input:not(.js-checkbox-master)'));
    loop.each(function (element, index) {
      expect(element.isSelected()).toBe(false);
    });
  });

  fit('un-check the master checkbox again', function () {
    var masterCheckbox;

    var allCheckboxes = element.all(by.css('.checkbox__label'));
    allCheckboxes.each(function (element, index) {
      if (index === 3) {
        element.click();
      }
    });



    masterCheckbox = element(by.css('.js-checkbox-master ~ .checkbox__label'));
    expect(masterCheckbox.isSelected()).toBe(false);

  });

});
