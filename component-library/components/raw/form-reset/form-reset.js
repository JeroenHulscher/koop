(function () {
  'use strict';

  onl.decorate({
    'init-formreset': function (element) {
      new formReset(element);
    }
  });

  var formReset = function (element) {
    this.element = element;
    this.config = JSON.parse(this.element.getAttribute('data-config')) || [];
    this.resetElementClass = this.config.resetElementClass || 'formreset-resetlink';

    this.resetLink = this.element.querySelector('.' + this.resetElementClass);

    this.initEventListeners();
  };

  formReset.prototype.initEventListeners = function() {
    this.resetLink.addEventListener('click', function (e) { this.resetForm(e); }.bind(this), false);
  };

  formReset.prototype.resetForm = function() {
    var y;

    this.inputs = this.element.querySelectorAll('input,select');

    for (y = 0; y < this.inputs.length; y++) {

      switch (this.inputs[y].getAttribute('type')) {
      case 'radio':
        if (this.inputs[y].checked) {
          this.inputs[y].checked = false;
        }
      }
    }
  };



})();
