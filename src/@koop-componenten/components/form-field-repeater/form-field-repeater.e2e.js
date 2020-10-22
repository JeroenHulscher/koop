describe('Form add-field', function () {

  var path = require('path');

  beforeEach(function () {
    browser.waitForAngularEnabled(false);
  });

  browser.manage().logs().get('browser').then(function (browserLogs) {
    // browserLogs is an array of objects with level and message fields
    browserLogs.forEach(function (log) {
      if (log.level.value > 900) { // it's an error log
        console.log('Browser console error!');
        console.log(log.message);
      }
      console.log(log.message);
    });
  });

  fit('on page load should show 2 form rows', function () {
    browser.get('http://localhost:3000/components/preview/form-field-repeater');

    var width = 1000;
    var height = 600;
    browser.driver.manage().window().setSize(width, height);

    browser.driver.sleep(500);

    function getVisibleRows(driver) {
      var rows = driver.findElements(by.css(".form__row"));

      return protractor.promise.filter(rows, function (row) {
        return row.isDisplayed();
      })
        .then(function (visibleRows) {
          return visibleRows;
        });
    }
    element.all(getVisibleRows).then(function (items) {
      expect(items.length).toEqual(2);
    });

  });

  fit('on button click should show 3 form rows', function () {

    buttonAdd = element(by.css('.js-form-fieldrepeater__addbutton'));
    buttonAdd.click();

    function getVisibleRows(driver) {
      var rows = driver.findElements(by.css(".form__row"));

      return protractor.promise.filter(rows, function (row) {
        return row.isDisplayed();
      })
        .then(function (visibleRows) {
          return visibleRows;
        });
    }
    element.all(getVisibleRows).then(function (items) {
      expect(items.length).toEqual(3);
    });

  });

  fit('new Id should be updated to 2001', function () {
    var row = element.all(by.css('.form__row')).get(1);
    var rowInput = row.element(by.css('.input'));
    var rowInputId = rowInput.getAttribute('id');
    var rowLabel = row.element(by.css('.form__label'));
    var rowLabelId = rowLabel.getAttribute('for');

    expect(rowLabelId).toEqual('input-text-2001');
    expect(rowInputId).toEqual('input-text-2001');
  });

  fit('on button click should show 4 form rows', function () {

    buttonAdd = element(by.css('.js-form-fieldrepeater__addbutton'));
    buttonAdd.click();

    function getVisibleRows(driver) {
      var rows = driver.findElements(by.css(".form__row"));

      return protractor.promise.filter(rows, function (row) {
        return row.isDisplayed();
      })
        .then(function (visibleRows) {
          return visibleRows;
        });
    }
    element.all(getVisibleRows).then(function (items) {
      expect(items.length).toEqual(4);
    });
  });

  fit('new Id should be updated to 20011', function () {
    var row = element.all(by.css('.form__row')).get(2);
    var rowInput = row.element(by.css('.input'));
    var rowInputId = rowInput.getAttribute('id');
    var rowLabel = row.element(by.css('.form__label'));
    var rowLabelId = rowLabel.getAttribute('for');

    expect(rowLabelId).toEqual('input-text-20011');
    expect(rowInputId).toEqual('input-text-20011');
  });

  fit('have the same name attribute', function () {
    var row1 = element.all(by.css('.form__row')).get(1);
    var row2 = element.all(by.css('.form__row')).get(2);

    var row1Input = row1.element(by.css('.input'));
    var row1InputName = row1Input.getAttribute('name');
    var row2Input = row2.element(by.css('.input'));
    var row2InputName = row2Input.getAttribute('name');

    expect(row1InputName).toEqual(row2InputName);
  });

});
