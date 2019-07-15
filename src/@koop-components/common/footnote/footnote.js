(function () {

  'use strict';

  onl.decorate({
    'init-footnote': function (element) {
      new footnote(element);
    }
  });

  var footnote = function (element) {
    this.element = element;
    this.footnote = document.querySelector(this.element.getAttribute('href'));
    this.referenceClass = '.reference';
    this.config = JSON.parse(this.element.getAttribute('data-config')) || [];
    this.init();
  };

  footnote.prototype.init = function () {
    this.element.setAttribute('id', 'footnumber' + Math.floor(Math.random() * (+10000 - +0)) + +0 );
    this.addEventListeners();
  };

  footnote.prototype.addEventListeners = function () {
    this.element.addEventListener('click', function (e) { this.setReferenceAnker(e); }.bind(this), false);
  };

  footnote.prototype.setReferenceAnker = function (e) {
    this.footnote.querySelector('.reference').setAttribute('href', '#' + this.element.getAttribute('id'));
  };

})();
