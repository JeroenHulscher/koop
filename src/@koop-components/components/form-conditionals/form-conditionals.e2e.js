describe('Form conditionals, should: ', function () {
  beforeEach(function () {
    browser.waitForAngularEnabled(false);
    browser.manage().logs()
      .get('browser').then(function (browserLog) {
        // console.log('log: ' +
        //   require('util').inspect(browserLog));
      });
  });

  it('1] activate second question on load', function () {

    browser.get('http://localhost:3000/components/preview/form-conditionals--default');
    browser.sleep(1000);

    expect($('#citem-2').isDisplayed()).toBe(true);
  });


  it('2] display "next question"-button after checkbox select', function () {
    var masterCheckbox;
    var button;

    masterCheckbox = element(by.css('#citem-2 .input-checkbox:first-child .checkbox__label'));
    masterCheckbox.click();

    browser.sleep(1000);

    button = element(by.css('#citem-2 button'));

    expect(button.isDisplayed()).toBe(true);
  });

  it('3] hide "next question"-button after checkbox de-select', function () {
    var masterCheckbox;
    var button;

    masterCheckbox = element(by.css('#citem-2 .input-checkbox:first-child .checkbox__label'));
    masterCheckbox.click();

    browser.sleep(500);

    button = element(by.css('#citem-2 button'));

    expect(button.isDisplayed()).toBe(false);
  });

  it('4] display "next question"-button after checkbox select', function () {
    var masterCheckbox;
    var button;

    masterCheckbox = element(by.css('#citem-2 .input-checkbox:first-child .checkbox__label'));
    masterCheckbox.click();

    browser.sleep(500);

    button = element(by.css('#citem-2 button'));

    expect(button.isDisplayed()).toBe(true);
  });

  it('5] display next question (3) after button click', function () {
    var button;

    button = element(by.css('#citem-2 button'));
    button.click();
    browser.sleep(500);

    expect($('#citem-3').isDisplayed()).toBe(true);
  });

  it('6] hide all future steps after checkbox de-select', function () {
    var masterCheckbox;
    var button;

    masterCheckbox = element(by.css('#citem-2 .input-checkbox:first-child .checkbox__label'));
    masterCheckbox.click();

    browser.sleep(500);

    button = element(by.css('#citem-2 button'));

    expect(button.isDisplayed()).toBe(false);
    expect($('#citem-3').isDisplayed()).toBe(false);
    expect($('#citem-4').isDisplayed()).toBe(false);
    expect($('.js-form-conditionals__submitcontainer').isDisplayed()).toBe(false);
  });

  it('7] display next question (3) after button click', function () {
    var button;

    masterCheckbox = element(by.css('#citem-2 .input-checkbox:first-child .checkbox__label'));
    masterCheckbox.click();

    button = element(by.css('#citem-2 button'));
    button.click();
    browser.sleep(500);

    expect($('#citem-3').isDisplayed()).toBe(true);
  });

  it('8] display SUBMIT after selecting blue', function () {
    var submit;
    var radioBlue;

    submit = element(by.css('.js-form-conditionals__submitcontainer'));

    radioBlue = element(by.css('#citem-3 #option-12 + .radio__label'));
    radioBlue.click();

    browser.sleep(1000);

    // button = element(by.css('#citem-2 button'));
    // button.click();
    // browser.sleep(500);

    expect(submit.isDisplayed()).toBe(true);
  });

  it('9] hide SUBMIT after selecting red and show next question', function () {
    var submit;
    var radioRed;

    submit = element(by.css('.js-form-conditionals__submitcontainer'));

    radioRed = element(by.css('#citem-3 #option-11 + .radio__label'));
    radioRed.click();

    browser.sleep(1000);

    // button = element(by.css('#citem-2 button'));
    // button.click();
    // browser.sleep(500);

    expect(submit.isDisplayed()).toBe(false);
    expect($('#citem-4').isDisplayed()).toBe(true);
  });

  it('10] display question 5 after select change', function () {
    var select;
    var submit = element(by.css('.js-form-conditionals__submitcontainer'));

    var selectDropdownbyNum = function (element, optionNum) {
      if (optionNum) {
        var options = element.all(by.tagName('option'))
          .then(function (options) {
            options[optionNum].click();
          });
      }
    };

    select = element(by.css('#citem-4 select'));
    selectDropdownbyNum(select, 2);

    browser.sleep(500);

    expect(submit.isDisplayed()).toBe(true);

    selectDropdownbyNum(select, 1);
    browser.sleep(500);

    expect($('#citem-5').isDisplayed()).toBe(true);

  });

  it('11] show final SUBMIT', function () {
    var submit;
    var radioRed;

    submit = element(by.css('.js-form-conditionals__submitcontainer'));

    radioRed = element(by.css('#citem-5 #option-31 + .radio__label'));
    radioRed.click();

    browser.sleep(1000);

    expect(submit.isDisplayed()).toBe(true);
  });

});
