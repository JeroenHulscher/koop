describe('The Modal', function () {
  beforeEach(function () {
    browser.waitForAngularEnabled(false);
  });

  it('opens when the open modal button is clicked', function () {
    var width = 400;
    var height = 800;
    var modalContent;
    var openModalButton;

    browser.get('http://localhost:3000/components/preview/templates-plooi-searchresults');

    browser.driver.manage().window().setSize(width, height);

    openModalButton = element(by.css('[data-handler="open-modalsidebar"]'));
    openModalButton.click();

    // Ensures the browser has enough time to open up the modal.
    browser.driver.sleep(750);

    modalContent = element(by.css('.modal-sidebar__content'));

    expect(modalContent.isDisplayed()).toBeTruthy();
  });

  it('closes when the close modal button is clicked', function () {
    var modalContent = element(by.css('.modal-sidebar__content'));
    var closeModalButton;

    expect(modalContent.isDisplayed()).toBeTruthy();

    closeModalButton = element(by.css('[data-handler="close-modalsidebar"]'));
    closeModalButton.click();

    browser.driver.sleep(250);

    expect(modalContent.isDisplayed()).toBeFalsy();
  });

});
