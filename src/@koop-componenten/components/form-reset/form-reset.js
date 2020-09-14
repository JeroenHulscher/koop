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

    this.elements = this.config.elements || 'input, select';
    this.resetElementClass = this.config.resetElementClass || 'formreset-resetlink';

    this.resetLink = this.element.querySelector('.' + this.resetElementClass);

    if (this.resetLink) {
      this.initEventListeners();
    }
  };

  formReset.prototype.initEventListeners = function() {
    this.resetLink.addEventListener('click', function (e) { this.resetForm(e); }.bind(this), false);
  };

  formReset.prototype.resetForm = function(e) {
    var y;
    var type;

    this.inputs = this.element.querySelectorAll(this.elements);

    for (y = 0; y < this.inputs.length; y++) {

      // get type
      if (this.inputs[y].nodeName === 'INPUT') {
        type = this.inputs[y].getAttribute('type')
      } else if (this.inputs[y].nodeName === 'SELECT') {
        type = 'select';
      }

      if (type) {
        switch (type) {
        case 'radio':
          if (this.inputs[y].checked) {
            this.inputs[y].checked = false;
          }
        case 'checkbox':
          if (this.inputs[y].checked) {
            this.inputs[y].checked = false;
          }
        case 'select':
          this.inputs[y].selectedIndex = 0;
          if ("createEvent" in document) {
            var evt = document.createEvent("HTMLEvents");
            evt.initEvent("change", true, true);
            this.inputs[y].dispatchEvent(evt);
          } else {
            this.inputs[y].fireEvent("change");
          }
        case 'text':
          this.inputs[y].value = '';
            // trigger keyUp event on input (for ie. filtersearch-results component)
            if ("createEvent" in document) {
              var evt = document.createEvent("HTMLEvents");
              evt.initEvent("keyup", false, true);
              this.inputs[y].dispatchEvent(evt);
            } else {
              this.inputs[y].fireEvent("keyup");
            }
        }
      }
    }

    e.preventDefault();
  };

})();
