(function() {
  'use strict';

  var collapse = function(element) {
    this.element = element;
    this.config = JSON.parse(this.element.getAttribute('data-config')) || [];
    this.init();
  };

  /**
   * Initialize a new collapse object. Has the possibility to provide a custom trigger in case
   * any (or more) of the collapsible are nested.
   */
  collapse.prototype.init = function() {
    // Only apply add event listener logic if a custom trigger was provided.
    if(typeof this.config.trigger !== 'undefined') {
      this.addEventListeners(document.querySelector('.trigger-collapse.' + this.config.trigger));
    } else {
      this.addEventListeners(document.querySelector('.trigger-collapse'));
    }
  };

  /**
   * Add event listeners.
   * @param trigger element used as trigger in the DOM.
   */
  collapse.prototype.addEventListeners = function(trigger) {
    trigger.addEventListener('click', function(e) {
      e.preventDefault();
      this.toggleCollapse();
    }.bind(this), false);
  };

  /**
   * Toggle the collapse by applying or removing the `collapsed` class.
   */
  collapse.prototype.toggleCollapse = function() {
    if(this.element.classList.contains('collapsed')) {
      this.element.classList.remove('collapsed');
    } else {
      this.element.classList.add('collapsed');
    }
  };

  onl.decorate({
    'handle-collapse': function(element) {
      new collapse(element);
    }
  });
})();
