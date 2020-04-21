describe('Subselection', function () {

  beforeEach(function () {
    browser.waitForAngularEnabled(false);
  });

  it('should display 3 results, when 4 checkboxes are selected', function () {
    browser.get('http://localhost:3000/components/preview/templates-verdr-wizard2');

    var width = 1200;
    var height = 800;
    var results;
    browser.driver.manage().window().setSize(width, height);

    browser.driver.sleep(500);

    var subTrigger = element(by.css('#id222'));
    subTrigger.click();

    browser.driver.sleep(1500);

    element(by.css('#modal-222 #option-1 ~ label')).click();
    element(by.css('#modal-222 #option-2 ~ label')).click();
    element(by.css('#modal-222 #option-3 ~ label')).click();
    element(by.css('#modal-222 #option-4 ~ label')).click();
    element(by.css('#modal-222 #option-5 ~ label')).click();

    var modalButton = element(by.css('.modal .button.button--primary'));
    modalButton.click();

    browser.driver.findElements(by.css('.subselection__summaryitem')).
      then(function (elems) {
        expect(elems.length).toEqual(5);
      }
    );
  });

  it('should remove item when clicked on X', function () {

    var itemRemoveTrigger = element(by.css('.subselection__summaryitem:first-child .subselection__summaryitem__remove'));
    itemRemoveTrigger.click();

    browser.driver.sleep(1500);

    browser.driver.findElements(by.css('.subselection__summaryitem')).
      then(function (elems) {
        expect(elems.length).toEqual(4);
      }
      );
  });


  it('should toggle the invisble results', function () {

    var moreTrigger = element(by.css('.link--down a'));
    moreTrigger.click();

    browser.driver.sleep(1500);

    var moreTrigger = element(by.css('.link--up a'));
    moreTrigger.click();

  });

  it('should reset the element', function () {

    var subTrigger = element(by.css('#id222'));
    subTrigger.click();

    browser.driver.sleep(1500);

    // element(by.css('#modal-222 #option-1 ~ label')).click();
    element(by.css('#modal-222 #option-2 ~ label')).click();
    element(by.css('#modal-222 #option-3 ~ label')).click();
    element(by.css('#modal-222 #option-4 ~ label')).click();
    element(by.css('#modal-222 #option-5 ~ label')).click();

    var modalButton = element(by.css('.modal .button.button--primary'));
    modalButton.click();

    browser.driver.sleep(500);

    expect(subTrigger.getText()).toEqual("Selecteer verdragen 'Haagse Conferentie voor Internationaal Privaatrecht'");

  });






  it('OLD COMPONENT: should display 1 result', function () {
    browser.get('http://localhost:3000/components/preview/templates-search-laws-complex---live');

    var width = 1200;
    var height = 800;
    var results;
    browser.driver.manage().window().setSize(width, height);

    browser.driver.sleep(500);

    var subTrigger = element(by.css('#ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_EerstVerantwoordelijke_Ministerie_selecteer'));
    subTrigger.click();

    browser.driver.sleep(1500);

    element(by.css('#ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_EerstVerantwoordelijke_Ministerie #ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_EerstVerantwoordelijke_Ministerie_item0')).click();

    var modalButton = element(by.css('#ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_EerstVerantwoordelijke_Ministerie .button.button--primary'));
    modalButton.click();

    browser.driver.sleep(3500);

    browser.driver.findElements(by.css('.subselection__summary abbr')).
      then(function (elems) {
        expect(elems.length).toEqual(1);
      }
      );
  });

  it('OLD COMPONENT: should reset the element', function () {

    var subTrigger = element(by.css('#ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_EerstVerantwoordelijke_Ministerie_selecteer'));
    subTrigger.click();

    browser.driver.sleep(1500);

    element(by.css('#ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_EerstVerantwoordelijke_Ministerie #ctl00_ctl00_cphContent_zoekpaginaContent_ZoekformulierUitgebreid_EerstVerantwoordelijke_Ministerie_item0')).click();

    var modalButton = element(by.css('.modal .button.button--primary'));
    modalButton.click();

    browser.driver.sleep(500);

    expect(subTrigger.getText()).toEqual("Selecteer");

  });


});
