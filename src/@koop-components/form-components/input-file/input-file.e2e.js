describe('Input - file', function () {

  var path = require('path');

  beforeEach(function () {
    browser.waitForAngularEnabled(false);
  });

  it('should select file and write name of file in label element', function () {
    browser.get('http://localhost:3000/components/preview/input-file');

    var input = element(by.css('input[type=file]'));
    var fileToUpload = '../../../assets/images/icon-dart-top.svg';
    var absolutePath = path.resolve(__dirname, fileToUpload);

    input.sendKeys(absolutePath);
    browser.driver.sleep(750);

    var label = element(by.css('label'));

    expect(label.getText()).toEqual('icon-dart-top.svg');
  });


});
