(function () {
  'use strict';

  onl.decorate({
    'init-browseralert': function (element) {
      new browseralert(element);
    }
  });

  var browseralert = function (element) {
    this.element = element;
    this.config = JSON.parse(this.element.getAttribute('data-config')) || [];
    var self = this;

    this.element.addEventListener('click', function (e) {
      if(window.confirm(e.target.getAttribute('data-alertmessage'))) {

      } else {
        e.preventDefault();
      }
    }.bind(this), false);
  };

})();
