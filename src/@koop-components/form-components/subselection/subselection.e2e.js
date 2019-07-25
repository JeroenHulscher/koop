describe('Subselection', function () {

  beforeEach(function () {
    browser.waitForAngularEnabled(false);
  });

  fit('should display 3 results, when 4 checkboxes are selected', function () {
    browser.get('http://localhost:3000/components/preview/templates-verdr-wizard2');

    var width = 1200;
    var height = 800;
    var results;
    browser.driver.manage().window().setSize(width, height);

    browser.driver.sleep(500);

    var subTrigger = element(by.css('#id123'));
    subTrigger.click();

    browser.driver.sleep(1500);

    element(by.css('#modal-222 #option-1 ~ label')).click();
    element(by.css('#modal-222 #option-2 ~ label')).click();
    element(by.css('#modal-222 #option-3 ~ label')).click();
    element(by.css('#modal-222 #option-4 ~ label')).click();

    var modalButton = element(by.css('.modal .button.button--primary'));
    modalButton.click();

    browser.driver.findElements(by.css('.subselection__summary span')).
      then(function (elems) {
        expect(elems.length).toEqual(4);
      }
    );
  });
  fit('should toggle the invisble results', function () {

    var moreTrigger = element(by.css('.link--down a'));
    moreTrigger.click();

    browser.driver.sleep(1500);

    var moreTrigger = element(by.css('.link--up a'));
    moreTrigger.click();

  });

  fit('should reset the element', function () {

    var subTrigger = element(by.css('#id123'));
    subTrigger.click();

    browser.driver.sleep(1500);

    element(by.css('#modal-222 #option-1 ~ label')).click();
    element(by.css('#modal-222 #option-2 ~ label')).click();
    element(by.css('#modal-222 #option-3 ~ label')).click();
    element(by.css('#modal-222 #option-4 ~ label')).click();

    var modalButton = element(by.css('.modal .button.button--primary'));
    modalButton.click();

    browser.driver.sleep(500);

    expect(subTrigger.getText()).toEqual("Selecteer verdragen 'Haagse Conferentie voor Internationaal Privaatrecht'");

  });

});
