describe('Form reset', function () {

  beforeEach(function () {
    browser.waitForAngularEnabled(false);
  });

  it('should display 5 results, after selecting one more.', function () {
    browser.get('http://localhost:3000/components/preview/form-reset');

    var width = 1200;
    var height = 800;

    browser.driver.manage().window().setSize(width, height);

    browser.driver.sleep(500);

    var subTrigger = element(by.css('#id1'));
    subTrigger.click();

    browser.driver.sleep(1500);

    element(by.css('#modal-1 #option-5 ~ label')).click();

    var modalButton = element(by.css('[data-handler="close-modal"]'));
    modalButton.click();

    browser.driver.sleep(500);

    browser.driver.findElements(by.css('.subselection__summaryitem')).
      then(function (elems) {
        expect(elems.length).toEqual(5);
      }
      );
  });


});
