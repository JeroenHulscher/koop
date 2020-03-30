describe('Form validation, should: ', function () {
  beforeEach(function () {
    browser.waitForAngularEnabled(false);
    browser.manage().logs()
      .get('browser').then(function (browserLog) {
        console.log('log: ' +
          require('util').inspect(browserLog));
      });
  });

  it('1] after submit, show error summary', function () {

    browser.get('http://localhost:3000/components/preview/form-validation');
    browser.sleep(1000);

    submit = element(by.css('.button'));
    submit.click();

    browser.sleep(500);

    errorContainer = element(by.css('.form__errors'));

    expect(errorContainer.isDisplayed()).toBe(true);

  });

  it('2] after submit, show field errors below field (10 fields)', function () {


    errorFieldContainer1 = element(by.css('#error-for-id'));
    errorFieldContainer2 = element(by.css('#error-for-id20'));
    errorFieldContainer3 = element(by.css('#error-for-tf1'));
    errorFieldContainer4 = element(by.css('#error-for-tf2'));
    errorFieldContainer5 = element(by.css('#error-for-nf2'));
    errorFieldContainer6 = element(by.css('#error-for-ef1'));
    errorFieldContainer7 = element(by.css('#error-for-zcf1'));
    errorFieldContainer9 = element(by.css('#error-for-select1'));
    errorFieldContainer10 = element(by.css('#error-for-option-checkbox-2'));


    expect(errorFieldContainer1.isDisplayed()).toBe(true);
    expect(errorFieldContainer2.isDisplayed()).toBe(true);
    expect(errorFieldContainer3.isDisplayed()).toBe(true);
    expect(errorFieldContainer4.isDisplayed()).toBe(true);
    expect(errorFieldContainer5.isDisplayed()).toBe(true);
    expect(errorFieldContainer6.isDisplayed()).toBe(true);
    expect(errorFieldContainer7.isDisplayed()).toBe(true);
    expect(errorFieldContainer9.isDisplayed()).toBe(true);
    expect(errorFieldContainer10.isDisplayed()).toBe(true);

  });

  it('3] after submit, show field errors in summary (10 fields)', function () {

    errorFieldContainer1 = element(by.css('[data-id="id"]'));
    errorFieldContainer1Text = errorFieldContainer1.getText();
    errorFieldContainer2 = element(by.css('[data-id="id20"]'));
    errorFieldContainer2Text = errorFieldContainer2.getText();
    errorFieldContainer3 = element(by.css('[data-id="tf1"]'));
    errorFieldContainer3Text = errorFieldContainer3.getText();
    errorFieldContainer4 = element(by.css('[data-id="tf2"]'));
    errorFieldContainer4Text = errorFieldContainer4.getText();
    errorFieldContainer5 = element(by.css('[data-id="nf2"]'));
    errorFieldContainer5Text = errorFieldContainer5.getText();
    errorFieldContainer6 = element(by.css('[data-id="ef1"]'));
    errorFieldContainer6Text = errorFieldContainer6.getText();
    errorFieldContainer7 = element(by.css('[data-id="zcf1"]'));
    errorFieldContainer7Text = errorFieldContainer7.getText();
    errorFieldContainer9 = element(by.css('[data-id="select1"]'));
    errorFieldContainer9Text = errorFieldContainer9.getText();
    errorFieldContainer10 = element(by.css('[data-id="option-checkbox-2"]'));
    errorFieldContainer10Text = errorFieldContainer10.getText();

    expect(errorFieldContainer1.isDisplayed()).toBe(true);
    expect(errorFieldContainer1Text).toContain("Kies 'iets'");
    expect(errorFieldContainer2.isDisplayed()).toBe(true);
    expect(errorFieldContainer2Text).toContain("Selecteer opties rondom een adres");
    expect(errorFieldContainer3.isDisplayed()).toBe(true);
    expect(errorFieldContainer3Text).toContain("Text field 1");
    expect(errorFieldContainer4.isDisplayed()).toBe(true);
    expect(errorFieldContainer4Text).toContain("Text field 2");
    expect(errorFieldContainer5.isDisplayed()).toBe(true);
    expect(errorFieldContainer5Text).toContain("Number field");
    expect(errorFieldContainer6.isDisplayed()).toBe(true);
    expect(errorFieldContainer6Text).toContain("Email field");
    expect(errorFieldContainer7.isDisplayed()).toBe(true);
    expect(errorFieldContainer7Text).toContain("Zipcode (dutch)");
    expect(errorFieldContainer9.isDisplayed()).toBe(true);
    expect(errorFieldContainer9Text).toContain("City of birth");
    expect(errorFieldContainer10.isDisplayed()).toBe(true);
    expect(errorFieldContainer10Text).toContain("Gaat u hiermee akkoord?");

  });

  it('4.1] after submit, when "Kies iets" is filled.. should remove errors.', function () {
    label = element(by.css('#id'));
    label.click();

    browser.sleep(500);

    radio = element(by.css('[for="option-4444"]'));
    radio.click();

    browser.sleep(500);

    closeModalButton = element(by.css('#modal- [data-handler="close-modal"]'));
    closeModalButton.click();

    browser.driver.sleep(500);

    body = element(by.css('body'));
    body.click();

    // check if error under field is gone;
    error = element(by.css('[id="error-for-id"]'));
    expect(error.isDisplayed()).toBe(false);

  });

  it('4.2] after submit, when "Kies iets" is filled.. should remove error in summary.', function () {

    waitForCssValue = function (elementFinder, cssProperty, cssValue) {
      return function () {
        return elementFinder.getCssValue(cssProperty).then(function (actualValue) {
          return actualValue === cssValue;
        });
      };
    };

    browser.driver.sleep(500);

    // check if error in summary has line through;
    errorInSummary = element(by.css('[data-id="id"]'));
    errorInSummaryLink = errorInSummary.element(by.css('.line-through'));

    expect(errorInSummaryLink.isPresent()).toBe(true);
  });

  it('5.1] after submit, when "Selecteer opties rondom een adres" is filled.. should remove errors.', function () {
    label = element(by.css('#id20'));
    label.click();

    browser.sleep(500);

    check = element(by.css('[for="option-1237"]'));
    check.click();

    browser.sleep(500);

    closeModalButton = element(by.css('#modal-20 [data-handler="close-modal"]'));
    closeModalButton.click();

    browser.driver.sleep(500);

    body = element(by.css('body'));
    body.click();

    // check if error under field is gone;
    error = element(by.css('[id="error-for-id20"]'));
    expect(error.isDisplayed()).toBe(false);

  });

  it('5.2] after submit, when "Selecteer opties rondom een adres" is filled.. should remove errors.', function () {

    waitForCssValue = function (elementFinder, cssProperty, cssValue) {
      return function () {
        return elementFinder.getCssValue(cssProperty).then(function (actualValue) {
          return actualValue === cssValue;
        });
      };
    };

    browser.driver.sleep(500);

    // check if error in summary has line through;
    errorInSummary = element(by.css('[data-id="id20"]'));
    errorInSummaryLink = errorInSummary.element(by.css('.line-through'));

    expect(errorInSummaryLink.isPresent()).toBe(true);
  });

  it('6.1] when "Text field 1" is filled wrongly.. should display errors.', function () {
    field = element(by.css('#tf1'));
    field.sendKeys('a');
    browser.actions().sendKeys(protractor.Key.TAB).perform();

    browser.driver.sleep(500);

    // check if error under field is gone;
    error = element(by.css('[id="error-for-tf1"]'));
    expect(error.isDisplayed()).toBe(true);
  });

  it('6.2] when "Text field 1" is filled correctly.. should remove errors.', function () {
    field = element(by.css('#tf1'));
    field.sendKeys(protractor.Key.BACK_SPACE);
    field.sendKeys('1');
    browser.actions().sendKeys(protractor.Key.TAB).perform();

    browser.driver.sleep(500);

    // check if error under field is gone;
    error = element(by.css('[id="error-for-tf1"]'));
    expect(error.isDisplayed()).toBe(false);
  });

  it('6.3] when "Text field 1" is filled correctly.. should remove errors in summary.', function () {
    waitForCssValue = function (elementFinder, cssProperty, cssValue) {
      return function () {
        return elementFinder.getCssValue(cssProperty).then(function (actualValue) {
          return actualValue === cssValue;
        });
      };
    };

    browser.driver.sleep(500);

    // check if error in summary has line through;
    errorInSummary = element(by.css('[data-id="tf1"]'));
    errorInSummaryLink = errorInSummary.element(by.css('.line-through'));

    expect(errorInSummaryLink.isPresent()).toBe(true);
  });

  it('7.1] when "Text field 2" is filled wrongly.. should display errors.', function () {
    field = element(by.css('#tf2'));
    field.sendKeys('a');
    browser.actions().sendKeys(protractor.Key.TAB).perform();

    browser.driver.sleep(500);

    // check if error under field is gone;
    error = element(by.css('[id="error-for-tf2"]'));
    expect(error.isDisplayed()).toBe(true);
  });

  it('7.2] when "Text field 2" is filled correctly.. should remove errors.', function () {
    field = element(by.css('#tf2'));
    field.sendKeys(protractor.Key.BACK_SPACE);
    field.sendKeys('1');
    browser.actions().sendKeys(protractor.Key.TAB).perform();

    browser.driver.sleep(500);

    // check if error under field is gone;
    error = element(by.css('[id="error-for-tf2"]'));
    expect(error.isDisplayed()).toBe(false);
  });

  it('7.3] when "Text field 2" is filled correctly.. should remove errors in summary.', function () {
    waitForCssValue = function (elementFinder, cssProperty, cssValue) {
      return function () {
        return elementFinder.getCssValue(cssProperty).then(function (actualValue) {
          return actualValue === cssValue;
        });
      };
    };

    browser.driver.sleep(500);

    // check if error in summary has line through;
    errorInSummary = element(by.css('[data-id="tf2"]'));
    errorInSummaryLink = errorInSummary.element(by.css('.line-through'));

    expect(errorInSummaryLink.isPresent()).toBe(true);
  });



  it('8.1] when "Number field 2" is filled correctly.. should remove errors.', function () {
    field = element(by.css('#nf2'));
    field.sendKeys('1');
    browser.actions().sendKeys(protractor.Key.TAB).perform();

    browser.driver.sleep(500);

    // check if error under field is gone;
    error = element(by.css('[id="error-for-nf2"]'));
    expect(error.isDisplayed()).toBe(false);
  });

  it('8.2] when "Number field 2" is filled correctly.. should remove errors in summary.', function () {
    waitForCssValue = function (elementFinder, cssProperty, cssValue) {
      return function () {
        return elementFinder.getCssValue(cssProperty).then(function (actualValue) {
          return actualValue === cssValue;
        });
      };
    };

    browser.driver.sleep(500);

    // check if error in summary has line through;
    errorInSummary = element(by.css('[data-id="nf2"]'));
    errorInSummaryLink = errorInSummary.element(by.css('.line-through'));

    expect(errorInSummaryLink.isPresent()).toBe(true);
  });

  it('9.1] when "Email" is filled wrongly.. should display errors.', function () {
    field = element(by.css('#ef1'));
    field.sendKeys('info@info');
    browser.actions().sendKeys(protractor.Key.TAB).perform();

    browser.driver.sleep(500);

    // check if error under field is gone;
    error = element(by.css('[id="error-for-ef1"]'));
    expect(error.isDisplayed()).toBe(true);
  });

  it('9.2] when "Email" is filled correctly.. should remove errors.', function () {
    field = element(by.css('#ef1'));
    field.sendKeys(protractor.Key.BACK_SPACE);
    field.sendKeys(protractor.Key.BACK_SPACE);
    field.sendKeys(protractor.Key.BACK_SPACE);
    field.sendKeys(protractor.Key.BACK_SPACE);
    field.sendKeys(protractor.Key.BACK_SPACE);
    field.sendKeys(protractor.Key.BACK_SPACE);
    field.sendKeys(protractor.Key.BACK_SPACE);
    field.sendKeys(protractor.Key.BACK_SPACE);
    field.sendKeys(protractor.Key.BACK_SPACE);
    field.sendKeys('info@info.nl');
    browser.actions().sendKeys(protractor.Key.TAB).perform();

    browser.driver.sleep(500);

    // check if error under field is gone;
    error = element(by.css('[id="error-for-ef1"]'));
    expect(error.isDisplayed()).toBe(false);
  });

  it('9.3] when "Email" is filled correctly.. should remove errors in summary.', function () {
    waitForCssValue = function (elementFinder, cssProperty, cssValue) {
      return function () {
        return elementFinder.getCssValue(cssProperty).then(function (actualValue) {
          return actualValue === cssValue;
        });
      };
    };

    browser.driver.sleep(500);

    // check if error in summary has line through;
    errorInSummary = element(by.css('[data-id="ef1"]'));
    errorInSummaryLink = errorInSummary.element(by.css('.line-through'));

    expect(errorInSummaryLink.isPresent()).toBe(true);
  });

  it('10.1] when "Zipcode" is filled wrongly.. should display errors.', function () {
    field = element(by.css('#zcf1'));
    field.sendKeys('1234');
    browser.actions().sendKeys(protractor.Key.TAB).perform();

    browser.driver.sleep(500);

    // check if error under field is gone;
    error = element(by.css('[id="error-for-zcf1"]'));
    expect(error.isDisplayed()).toBe(true);
  });

  it('10.2] when "Zipcode" is filled correctly.. should remove errors.', function () {
    field = element(by.css('#zcf1'));
    field.sendKeys('AZ');
    browser.actions().sendKeys(protractor.Key.TAB).perform();

    browser.driver.sleep(500);

    // check if error under field is gone;
    error = element(by.css('[id="error-for-zcf1"]'));
    expect(error.isDisplayed()).toBe(false);
  });

  it('10.3] when "Zipcode" is filled correctly.. should remove errors in summary.', function () {
    waitForCssValue = function (elementFinder, cssProperty, cssValue) {
      return function () {
        return elementFinder.getCssValue(cssProperty).then(function (actualValue) {
          return actualValue === cssValue;
        });
      };
    };

    browser.driver.sleep(500);

    // check if error in summary has line through;
    errorInSummary = element(by.css('[data-id="zcf1"]'));
    errorInSummaryLink = errorInSummary.element(by.css('.line-through'));

    expect(errorInSummaryLink.isPresent()).toBe(true);
  });

  // it('11.1] when "Radio" is clicked.. should remove error.', function () {
  //   radio = element(by.css('[for="option-3"]'));
  //   radio.click();

  //   browser.driver.sleep(500);

  //   // check if error under field is gone;
  //   error = element(by.css('[id="error-for-option-5"]'));
  //   expect(error.isDisplayed()).toBe(false);
  // });

  // it('11.2] when "Radio" is clicked.. should remove error in summary.', function () {
  //   waitForCssValue = function (elementFinder, cssProperty, cssValue) {
  //     return function () {
  //       return elementFinder.getCssValue(cssProperty).then(function (actualValue) {
  //         return actualValue === cssValue;
  //       });
  //     };
  //   };

  //   browser.driver.sleep(500);

  //   // check if error in summary has line through;
  //   errorInSummary = element(by.css('[data-id="option-3"]'));
  //   errorInSummaryLink = errorInSummary.element(by.css('.line-through'));

  //   expect(errorInSummaryLink.isPresent()).toBe(true);
  // });

  it('11.1] when "Select" is changed.. should remove error.', function () {
    var select = element(by.css('#select1'));
    select.sendKeys('London');
    browser.actions().sendKeys(protractor.Key.TAB).perform();

    browser.driver.sleep(500);

    // check if error under field is gone;
    error = element(by.css('[id="error-for-select1"]'));
    expect(error.isDisplayed()).toBe(false);
  });

  it('11.2] when "Select" is changed to empty.. should display error.', function () {
    var select = element(by.css('#select1'));
    select.sendKeys('Choose COB');
    browser.actions().sendKeys(protractor.Key.TAB).perform();

    browser.driver.sleep(500);

    // check if error under field is gone;
    error = element(by.css('[id="error-for-select1"]'));
    expect(error.isDisplayed()).toBe(true);
  });

  it('11.3] when "Select" is changed.. should remove error.', function () {
    var select = element(by.css('#select1'));
    select.sendKeys('London');
    browser.actions().sendKeys(protractor.Key.TAB).perform();

    browser.driver.sleep(500);

    // check if error under field is gone;
    error = element(by.css('[id="error-for-select1"]'));
    expect(error.isDisplayed()).toBe(false);
  });

  it('11.4] when "Select" is changed.. should remove error in summary.', function () {
    waitForCssValue = function (elementFinder, cssProperty, cssValue) {
      return function () {
        return elementFinder.getCssValue(cssProperty).then(function (actualValue) {
          return actualValue === cssValue;
        });
      };
    };

    browser.driver.sleep(500);

    // check if error in summary has line through;
    errorInSummary = element(by.css('[data-id="select1"]'));
    errorInSummaryLink = errorInSummary.element(by.css('.line-through'));

    expect(errorInSummaryLink.isPresent()).toBe(true);
  });

  it('X] after submit, and everything EXCEPT ONE is filled in, should display 1 summary error', function () {

    submit = element(by.css('.button'));
    submit.click();

    browser.sleep(500);

    errorContainer = element.all(by.css('.form__errors li'));

    var visibleDivs = errorContainer.filter(function (link) {
      return link.isDisplayed();
    });

    expect(visibleDivs.count()).toEqual(1);
  });

  it('12.1] after submit, when "checkbox" is checked.. should remove errors.', function () {

    check = element(by.css('[for="option-checkbox-2"]'));
    check.click();

    browser.sleep(500);

    // check if error under field is gone;
    error = element(by.css('[id="error-for-option-checkbox-2"]'));
    expect(error.isDisplayed()).toBe(false);

  });

  it('12.2] after submit, when "checkbox" is un-checked.. should display errors.', function () {

    check = element(by.css('[for="option-checkbox-2"]'));
    check.click();

    browser.sleep(500);

    // check if error under field is gone;
    error = element(by.css('[id="error-for-option-checkbox-2"]'));
    expect(error.isDisplayed()).toBe(true);

  });

  it('12.3] after submit, when "checkbox" is checked.. should remove errors.', function () {

    check = element(by.css('[for="option-checkbox-2"]'));
    check.click();

    browser.sleep(500);

    // check if error under field is gone;
    error = element(by.css('[id="error-for-option-checkbox-2"]'));
    expect(error.isDisplayed()).toBe(false);

  });

  it('12.4] after submit, when "checkbox" is checked.. should remove error in summary.', function () {
    waitForCssValue = function (elementFinder, cssProperty, cssValue) {
      return function () {
        return elementFinder.getCssValue(cssProperty).then(function (actualValue) {
          return actualValue === cssValue;
        });
      };
    };

    browser.driver.sleep(500);

    // check if error in summary has line through;
    errorInSummary = element(by.css('[data-id="option-checkbox-2"]'));
    errorInSummaryLink = errorInSummary.element(by.css('.line-through'));

    expect(errorInSummaryLink.isPresent()).toBe(true);
  });



});
