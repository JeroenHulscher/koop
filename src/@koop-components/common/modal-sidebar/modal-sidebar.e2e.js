describe('The Modal', function() {
  beforeEach(function() {
    browser.waitForAngularEnabled(false);
  });

  it('opens when the open modal button is clicked', function() {
    var width = 1000;
    var height = 800;
    var modalContent;
    var openModalButton;

    browser.get('http://localhost:3000/components/preview/modal--default');

    browser.driver.manage().window().setSize(width, height);

    openModalButton = element(by.css('[data-handler="open-modal"]'));
    openModalButton.click();

    // Ensures the browser has enough time to open up the modal.
    browser.driver.sleep(750);

    modalContent = element(by.css('.modal__content'));

    expect(modalContent.isDisplayed()).toBeTruthy();
  });

  it('does not leave the view when the browser resizes', function() {
    var windowHeight = 800;
    var modalContent = element(by.css('.modal__content'));

    modalContent.getSize().then(function(modalSize) {
      expect(modalSize.height < windowHeight);

      windowHeight = 600;

      browser.driver.manage().window().setSize(1000, windowHeight);

      modalContent.getSize().then(function(newModalSize) {
        expect(newModalSize.height < windowHeight);
      });
    });
  });

  it('closes when the close modal button is clicked', function() {
    var modalContent = element(by.css('.modal__content'));
    var closeModalButton;

    expect(modalContent.isDisplayed()).toBeTruthy();

    closeModalButton = element(by.css('[data-handler="close-modal"]'));
    closeModalButton.click();

    browser.driver.sleep(250);

    expect(modalContent.isDisplayed()).toBeFalsy();
  });

  it('opens using spacebar on the open modal button', function() {
    // Ensure the element focussed is the open modal button.
    expect('Open modal').toEqual(browser.driver.switchTo().activeElement().getText());

    browser.actions().sendKeys(protractor.Key.SPACE).perform();
    browser.driver.sleep(750);

    var modalContent = element(by.css('.modal__content'));
    expect(modalContent.isDisplayed()).toBeTruthy();
  });

  it('closes using tab and spacebar on the close modal button', function() {
    var modalContent = element(by.css('.modal__content'));

    browser.actions().sendKeys(protractor.Key.TAB).perform();
    browser.actions().sendKeys(protractor.Key.SPACE).perform();
    browser.driver.sleep(250);

    expect(modalContent.isDisplayed()).toBeFalsy();
  });
});
