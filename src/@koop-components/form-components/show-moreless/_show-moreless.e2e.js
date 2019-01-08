describe('Show more-hide', function () {

  var path = require('path');

  beforeEach(function () {
    browser.waitForAngularEnabled(false);
  });

  it('on page load should show 5 items', function () {
    browser.get('http://localhost:3000/components/preview/show-moreless');

    var width = 1000;
    var height = 600;
    browser.driver.manage().window().setSize(width, height);

    browser.driver.sleep(500);

    function getVisibleDivs(driver) {
      var links = driver.findElements(by.css("li"));

      return protractor.promise.filter(links, function (link) {
        return link.isDisplayed();
      })
        .then(function (visibleLinks) {
          return visibleLinks;
        });
    }
    element.all(getVisibleDivs).then(function (items) {
      expect(items.length).toEqual(6);
    });

  });


  it('when clicked on trigger open, show 21 items', function () {

    var trigger = element(by.css('.link--down'));
    var list = element(by.css('ul'));
    trigger.click();

    function getVisibleDivs(driver) {
      var links = driver.findElements(by.css("li"));

      return protractor.promise.filter(links, function (link) {
        return link.isDisplayed();
      })
        .then(function (visibleLinks) {
          return visibleLinks;
        });
    }
    element.all(getVisibleDivs).then(function (items) {
      expect(items.length).toEqual(21);
    });
  });

  it('when clicked on trigger close, show 5 items', function () {

    var trigger = element(by.css('.link--up'));
    var list = element(by.css('ul'));
    trigger.click();

    function getVisibleDivs(driver) {
      var links = driver.findElements(by.css("li"));

      return protractor.promise.filter(links, function (link) {
        return link.isDisplayed();
      })
        .then(function (visibleLinks) {
          return visibleLinks;
        });
    }
    element.all(getVisibleDivs).then(function (items) {
      expect(items.length).toEqual(6);
    });
  });

});
