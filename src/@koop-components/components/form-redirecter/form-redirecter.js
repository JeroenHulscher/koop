(function () {
  'use strict';

  onl.decorate({
    'init-formredirecter': function (element) {
      new formredirecter(element);
    }
  });

  var formredirecter = function (element) {
    this.element = element;
    this.config = JSON.parse(this.element.getAttribute('data-config')) || [];

    this.element.field = this.config.field || '.js-form-redirecter__field';
    this.root = location.protocol + '//' + location.host;

    this.element.addEventListener('submit', function (e) {
      e.preventDefault();
      this.formValue = this.element.querySelector(this.element.field).value;
      window.location = this.root + '/' + this.formValue;
    }.bind(this), false);
  };

})();
