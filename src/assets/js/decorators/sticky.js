(function() {
  'use strict';

  var sticky = function(element) {
    this.element = element;
    this.config = JSON.parse(this.element.getAttribute('data-config')) || [];
    this.position = this.config.position || 'top';
    this.init();
  };

  sticky.prototype.init = function() {
    stickybits(this.element, { useStickyClasses: true, verticalPosition: this.position });
  };

  onl.decorate({
    'init-sticky': function(element) {
      new sticky(element);
    }
  });
})();
