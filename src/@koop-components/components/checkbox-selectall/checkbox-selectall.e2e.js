describe('Select all', function () {
  beforeEach(function () {
    browser.waitForAngularEnabled(false);
    browser.manage().logs()
      .get('browser').then(function (browserLog) {
        console.log('log: ' +
          require('util').inspect(browserLog));
      });
  });

  it('selects all checkboxes when selecting the master (select-all) checkbox', function () {
    var masterCheckbox;

    browser.get('http://localhost:3000/components/preview/checkbox-selectall');
    browser.sleep(100);

    masterCheckbox = element(by.css('.js-checkbox-master ~ .checkbox__label'));
    masterCheckbox.click();

    var loop = element.all(by.css('.checkbox__input'));
    loop.each(function (element, index) {
      expect(element.isSelected()).toBe(true);
    });
  });

  it('de-selects all checkboxes when selecting the master (select-all) checkbox again', function () {
    var masterCheckbox;

    masterCheckbox = element(by.css('.js-checkbox-master ~ .checkbox__label'));
    masterCheckbox.click();

    var loop = element.all(by.css('.checkbox__input'));
    loop.each(function (element, index) {
      expect(element.isSelected()).toBe(false);
    });
  });

  it('selects all checkboxes when selecting the master (select-all) checkbox', function () {
    var masterCheckboxLabel;
    var masterCheckbox;

    masterCheckbox = element(by.css('.js-checkbox-master'));

    masterCheckboxLabel = element(by.css('.js-checkbox-master ~ .checkbox__label'));
    masterCheckboxLabel.click();


    var allCheckboxes = element.all(by.css('.checkbox__label'));
    allCheckboxes.each(function (element, index) {
      if (index === 3) {
        element.click();
      }
    });

    expect(masterCheckbox.isSelected()).toBe(false);

  });

});
