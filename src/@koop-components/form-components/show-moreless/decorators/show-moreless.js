

(function () {

  'use strict';

  onl.decorate({
    showmoreless: function(element) {
      new showmoreless(element);
    }
  });

  var showmoreless = function(element) {
    this.element = element;
    this.listitems = [].slice.call(this.element.querySelectorAll('li'));
    this.config = JSON.parse(this.element.getAttribute('data-config')) || [];
    this.config.amountVisible = this.config.amount || '5';
    this.init();
  };

  showmoreless.prototype.init = function() {
    this.hideElements();
  };

  showmoreless.prototype.hideElements = function() {
    var i;

    for ( i = 0; i < this.listitems.length; i++ ) {
      if ( i > this.config.amountVisible - 1 ) {
        this.listitems[i].setAttribute('hidden', 'true');
      }
    }
    if ( i > this.config.amountVisible) {
      this.addTrigger();
    }
  };

  showmoreless.prototype.addTrigger = function() {
    this.trigger = document.createElement('li');
    this.trigger.classList.add('link');
    this.trigger.classList.add('link--down');
    this.trigger.innerHTML = 'Toon meer';

    this.element.querySelector('ul').appendChild(this.trigger);

    this.trigger.addEventListener('click', function(e) { this.showAll(e); }.bind(this), false);
  };

  showmoreless.prototype.showAll = function() {
    var i;

    for ( i = 0; i < this.listitems.length; i++ ) {
      this.listitems[i].removeAttribute('hidden', 'true');
    }
    this.removeTrigger();
  };

  showmoreless.prototype.removeTrigger = function() {
    this.trigger.parentNode.removeChild(this.trigger);
  };

})();
