describe('Subselection', function () {

  beforeEach(function () {
    browser.waitForAngularEnabled(false);
  });

  it('should display 5 results, after selecting one more.', function () {
    browser.get('http://localhost:3000/components/preview/subselection--with-limit-(3)');

    var width = 1200;
    var height = 800;
    var results;
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

  it('should disgard changes when selected different inputs on cancel modal', function () {

    var subTrigger = element(by.css('#id1'));
    subTrigger.click();

    browser.driver.sleep(1500);

    element(by.css('#modal-1 #option-1 ~ label')).click();
    element(by.css('#modal-1 #option-2 ~ label')).click();
    element(by.css('#modal-1 #option-3 ~ label')).click();

    browser.driver.sleep(500);

    var modalTriggerDisgard = element(by.css('.modal .modal__close'));
    modalTriggerDisgard.click();

    browser.driver.sleep(500);

    browser.driver.findElements(by.css('.subselection__summaryitem')).
      then(function (elems) {
        expect(elems.length).toEqual(5);
      }
      );
  });

  it('should remove item when clicked on X of item', function () {

    var itemRemoveTrigger = element(by.css('.subselection__summaryitem:first-child .subselection__summaryitem__remove'));
    itemRemoveTrigger.click();

    browser.driver.sleep(500);

    var itemRemoveTrigger = element(by.css('.subselection__summaryitem:first-child .subselection__summaryitem__remove'));
    itemRemoveTrigger.click();

    browser.driver.sleep(500);

    var itemRemoveTrigger = element(by.css('.subselection__summaryitem:first-child .subselection__summaryitem__remove'));
    itemRemoveTrigger.click();

    browser.driver.sleep(500);

    browser.driver.findElements(by.css('.subselection__summaryitem')).
      then(function (elems) {
        expect(elems.length).toEqual(2);
      }
      );
  });

  it('should keep the same amount if discarded directly', function () {

    var subTrigger = element(by.css('#id1'));
    subTrigger.click();

    browser.driver.sleep(500);

    var modalTriggerDisgard = element(by.css('.modal .modal__close'));
    modalTriggerDisgard.click();

    browser.driver.sleep(500);

    browser.driver.findElements(by.css('.subselection__summaryitem')).
      then(function (elems) {
        expect(elems.length).toEqual(2);
      }
      );
  });

  it('should disgard changes when selected different inputs on cancel modal', function () {

    var subTrigger = element(by.css('#id1'));
    subTrigger.click();

    browser.driver.sleep(1500);

    element(by.css('#modal-1 #option-1 ~ label')).click();

    browser.driver.sleep(500);

    var modalTriggerDisgard = element(by.css('.modal .modal__close'));
    modalTriggerDisgard.click();

    browser.driver.sleep(500);

    browser.driver.findElements(by.css('.subselection__summaryitem')).
      then(function (elems) {
        expect(elems.length).toEqual(2);
      }
      );
  });

  it('should display 3 items, after selection one more', function () {

    var subTrigger = element(by.css('#id1'));
    subTrigger.click();

    browser.driver.sleep(1500);

    element(by.css('#modal-1 #option-1 ~ label')).click();
    element(by.css('#modal-1 #option-2 ~ label')).click();

    browser.driver.sleep(500);

    var modalButton = element(by.css('[data-handler="close-modal"]'));
    modalButton.click();

    browser.driver.sleep(500);

    browser.driver.findElements(by.css('.subselection__summaryitem')).
      then(function (elems) {
        expect(elems.length).toEqual(4);
      }
      );
  });

  it('should disgard changes when selected different inputs on cancel modal', function () {

    var subTrigger = element(by.css('#id1'));
    subTrigger.click();

    browser.driver.sleep(1500);

    element(by.css('#modal-1 #option-3 ~ label')).click();

    browser.driver.sleep(500);

    var modalTriggerDisgard = element(by.css('.modal .modal__close'));
    modalTriggerDisgard.click();

    browser.driver.sleep(500);

    browser.driver.findElements(by.css('.subselection__summaryitem')).
      then(function (elems) {
        expect(elems.length).toEqual(4);
      }
      );
  });

  // it('should have 5 active filters when selected the other 4.', function () {

  //   var subTrigger = element(by.css('#id1'));
  //   subTrigger.click();

  //   browser.driver.sleep(1500);

  //   element(by.css('#modal-1 #option-1 ~ label')).click();
  //   element(by.css('#modal-1 #option-3 ~ label')).click();
  //   element(by.css('#modal-1 #option-4 ~ label')).click();
  //   element(by.css('#modal-1 #option-5 ~ label')).click();

  //   browser.driver.sleep(500);

  //   var modalButton = element(by.css('[data-handler="close-modal"]'));
  //   modalButton.click();

  //   browser.driver.sleep(500);

  //   browser.driver.findElements(by.css('.subselection__summaryitem')).
  //     then(function (elems) {
  //       expect(elems.length).toEqual(5);
  //     }
  //     );
  // });


  it('should toggle the invisble results', function () {

    var moreTrigger = element(by.css('.link--down a'));
    moreTrigger.click();

    browser.driver.sleep(1500);

    var moreTrigger = element(by.css('.link--up a'));
    moreTrigger.click();

  });

  it('should reset the element to the original trigger label', function () {

    var subTrigger = element(by.css('#id1'));
    subTrigger.click();

    browser.driver.sleep(1500);

    // element(by.css('#modal-222 #option-1 ~ label')).click();
    element(by.css('#modal-1 #option-1 ~ label')).click();
    element(by.css('#modal-1 #option-2 ~ label')).click();
    element(by.css('#modal-1 #option-4 ~ label')).click();
    element(by.css('#modal-1 #option-5 ~ label')).click();

    var modalButton = element(by.css('[data-handler="close-modal"]'));
    modalButton.click();

    browser.driver.sleep(500);

    expect(subTrigger.getText()).toEqual("Kies 'iets'");

  });

  it('should have its buttonSelectAll in the default state', function () {
    browser.get('http://localhost:3000/components/preview/subselection--with-catagories-and-select-all');

    var width = 1200;
    var height = 800;
    var results;
    browser.driver.manage().window().setSize(width, height);

    browser.driver.sleep(500);

    var subTrigger = element(by.css('#id1'));
    subTrigger.click();

    browser.driver.sleep(1500);

    var buttonSelectall = element(by.css('.js-filterresults__btn-selectall'))

    expect(buttonSelectall.getText()).toEqual("Selecteer alle organisaties");
  });

  it('should have its buttonSelectAll in the searched state ("dam")', function () {
    var fieldSearch = element(by.css('#filter-id--1'));
    fieldSearch.sendKeys('dam');

    browser.driver.sleep(500);

    var buttonSelectall = element(by.css('.js-filterresults__btn-selectall'));

    expect(buttonSelectall.getText()).toEqual('Selecteer alle "dam"');
  });

  it('should only have 1 category as result', function () {
    browser.driver.findElements(by.css('.js-filterresults__resultmother[aria-hidden="true"]')).
      then(function (elems) {
        expect(elems.length).toEqual(2);
      }
      );
  });

  it('should only have 5 visible results', function () {
    browser.driver.findElements(by.css('.js-filterresults__result.is-visible')).
      then(function (elems) {
        expect(elems.length).toEqual(5);
      }
      );
  });

  it('should have ZERO visible results', function () {
    var fieldSearch = element(by.css('#filter-id--1'));
    fieldSearch.sendKeys('a');

    browser.driver.sleep(500);

    browser.driver.findElements(by.css('.js-filterresults__result.is-visible')).
      then(function (elems) {
        expect(elems.length).toEqual(0);
      }
      );
  });
  it('should have ZERO visible results and its buttonSelectAll INVISIBLE', function () {
    var buttonSelectall = element(by.css('.js-filterresults__btn-selectall'));
    expect(buttonSelectall.isDisplayed()).toBeFalsy();
  });


  it('should have ZERO visible results and display noresults-message', function () {
    browser.driver.findElements(by.css('#alert-resultfilter-1')).
      then(function (elems) {
        expect(elems.length).toEqual(1);
      }
    );
  });

  it('should reset the searchfield after clicking the reset-button', function () {
    var buttonReset = element(by.css('.formreset-resetlink'));
    buttonReset.click();

    var fieldSearch = element(by.css('#filter-id--1'));

    browser.driver.sleep(500);

    expect(fieldSearch.getText()).toEqual('');
  });

  it('should reset the searchfield after clicking the clear-button', function () {
    var fieldSearch = element(by.css('#filter-id--1'));
    fieldSearch.sendKeys('dam');

    browser.driver.sleep(500);

    var buttonClear = element(by.css('.input-text__remove'));
    buttonClear.click();

    browser.driver.sleep(500);

    expect(fieldSearch.getText()).toEqual('');
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

    var modalButton = element(by.css('[data-handler="close-modal"]'));
    modalButton.click();

    browser.driver.sleep(500);

    expect(subTrigger.getText()).toEqual("Selecteer");

  });


});
