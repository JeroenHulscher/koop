(function () {

  'use strict';

  var tooltip = function( element ) {
    this.element = element;
    this.config = JSON.parse( this.element.getAttribute( 'data-config' ) ) || [];
    this.trigger = this.element.querySelector(this.config.trigger) || this.element.querySelector( '.tooltip__trigger' );
    this.content = this.element.querySelector(this.config.content) || this.element.querySelector( '.tooltip__content' );
    this.init();
  };

  tooltip.prototype.init = function( ) {
    this.trigger.addEventListener('mouseover', function (e) { this.showTooltip(e); }.bind(this), false);
    this.trigger.addEventListener('focus', function (e) { this.showTooltip(e); }.bind(this), false);
    this.trigger.addEventListener('keyup', function (e) { this.hideTooltipKeyboard(e); }.bind(this), false);
    this.trigger.addEventListener('mouseout', function (e) { this.hideTooltip(e); }.bind(this), false);
    this.trigger.addEventListener('blur', function (e) { this.hideTooltip(e); }.bind(this), false);
  };

  tooltip.prototype.showTooltip = function () {
    var all = document.querySelectorAll('.tooltip__content');
    for (i = 0; i < all.length; i++) {
      all[i].setAttribute('aria-hidden', 'true');
      all[i].setAttribute('style', 'display:none');
      // this.trigger.setAttribute('aria-expanded', 'true');
    }
    this.trigger.setAttribute('aria-expanded', 'true');
    this.element.classList.add('is-active');
  };

  tooltip.prototype.hideTooltip = function () {
    this.trigger.setAttribute('aria-expanded', 'false');
    this.element.classList.remove('is-active');
  };

  tooltip.prototype.hideTooltipKeyboard = function (e) {
    if (e.keyCode == "27") {
      this.hideTooltip(e);
    }
  };

  onl.decorate({
    tooltip: function( element ) {
      new tooltip ( element );
    }
  });

})();
