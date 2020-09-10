(function () {
  'use strict';

  onl.decorate({
    'init-printtrigger': function (element) {
      new printtrigger(element);
    }
  });

  var printtrigger = function (element) {
    this.element = element;
    this.config = JSON.parse(this.element.getAttribute('data-config')) || [];

    this.element.addEventListener('click', function (e) {
      window.print();
      e.preventDefault();
    }.bind(this), false);
  };

})();
