describe('Filtersearch', function () {

  beforeEach(function () {
    browser.waitForAngularEnabled(false);
  });

  fit('should still result all with accents', function () {
    browser.get('http://localhost:3000/components/preview/filtersearch-results--default');

    var width = 1200;
    var height = 800;
    var results;
    browser.driver.manage().window().setSize(width, height);

    var fieldSearch = element(by.css('#filter-id--176575675'));
    fieldSearch.sendKeys('fra');

    browser.driver.sleep(500);

    browser.driver.findElements(by.css('.js-filterresults__result.is-visible')).
      then(function (elems) {
        expect(elems.length).toEqual(6);
      }
      );
  });



});
