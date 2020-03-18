describe('Form validation, should: ', function () {
  beforeEach(function () {
    browser.waitForAngularEnabled(false);
    browser.manage().logs()
      .get('browser').then(function (browserLog) {
        console.log('log: ' +
          require('util').inspect(browserLog));
      });
  });

  xit('1] after submit, show error summary', function () {

    browser.get('http://localhost:3000/components/preview/form-validation');
    browser.sleep(1000);

    submit = element(by.css('.button'));
    submit.click();

    browser.sleep(500);

    errorContainer = element(by.css('.form__errors'));

    expect(errorContainer.isDisplayed()).toBe(true);

  });

  xit('2] after submit, show field errors below field (10 fields)', function () {

    errorFieldContainer1 = element(by.css('#error-for-option-3333'));
    errorFieldContainer2 = element(by.css('#error-for-id20'));
    errorFieldContainer3 = element(by.css('#error-for-tf1'));
    errorFieldContainer4 = element(by.css('#error-for-tf2'));
    errorFieldContainer5 = element(by.css('#error-for-nf2'));
    errorFieldContainer6 = element(by.css('#error-for-ef1'));
    errorFieldContainer7 = element(by.css('#error-for-appel3'));
    errorFieldContainer8 = element(by.css('#error-for-option-5'));
    errorFieldContainer9 = element(by.css('#error-for-select1'));
    errorFieldContainer10 = element(by.css('#error-for-option-checkbox-2'));

    expect(errorFieldContainer1.isDisplayed()).toBe(true);
    expect(errorFieldContainer2.isDisplayed()).toBe(true);
    expect(errorFieldContainer3.isDisplayed()).toBe(true);
    expect(errorFieldContainer4.isDisplayed()).toBe(true);
    expect(errorFieldContainer5.isDisplayed()).toBe(true);
    expect(errorFieldContainer6.isDisplayed()).toBe(true);
    expect(errorFieldContainer7.isDisplayed()).toBe(true);
    expect(errorFieldContainer8.isDisplayed()).toBe(true);
    expect(errorFieldContainer9.isDisplayed()).toBe(true);
    expect(errorFieldContainer10.isDisplayed()).toBe(true);

  });

  xit('3] after submit, show field errors in summary (10 fields)', function () {

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
    errorFieldContainer7 = element(by.css('[data-id="appel3"]'));
    errorFieldContainer7Text = errorFieldContainer7.getText();
    errorFieldContainer8 = element(by.css('[data-id="option-3"]'));
    errorFieldContainer8Text = errorFieldContainer8.getText();
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
    expect(errorFieldContainer8.isDisplayed()).toBe(true);
    expect(errorFieldContainer8Text).toContain("Radius zoekgeschiedenis");
    expect(errorFieldContainer9.isDisplayed()).toBe(true);
    expect(errorFieldContainer9Text).toContain("City of birth");
    expect(errorFieldContainer10.isDisplayed()).toBe(true);
    expect(errorFieldContainer10Text).toContain("Gaat u hiermee akkoord?");

  });

  xit('4] after submit, when "Kies iets" is filled.. should remove errors.', function () {
    label = element(by.css('#id'));
    label.click();

    browser.sleep(500);

    radio = element(by.css('[for="option-4444"]'));
    radio.click();

    browser.sleep(500);

    // check if error under field is gone;
    error = radio = element(by.css('[id="error-for-option-3333"]'));
    expect(error.isDisplayed()).toBe(false);

    waitForCssValue = function (elementFinder, cssProperty, cssValue) {
      return function () {
        return elementFinder.getCssValue(cssProperty).then(function (actualValue) {
          return actualValue === cssValue;
        });
      };
    };

    // check if error in summary has line through;
    errorInSummary = element(by.css('[data-id="id"]'));
    errorInSummaryLink = errorInSummary.element(by.css('.line-through'));

    expect(errorInSummaryLink.isPresent()).toBeFalsy();
  });

});
