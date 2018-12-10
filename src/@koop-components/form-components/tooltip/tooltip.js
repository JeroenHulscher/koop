(function () {

  'use strict';

  var tooltip = function( element ) {
    this.element = element;
    this.config = JSON.parse( this.element.getAttribute( 'data-config' ) ) || [];
    this.trigger = this.element.querySelector(this.config.trigger) || this.element.querySelector( '.tooltip__trigger' );
    this.content = document.getElementById(this.trigger.getAttribute('aria-describedby'));
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
    var i;

    for (i = 0; i < all.length; i++) {
      all[i].setAttribute('aria-hidden', 'true');
      all[i].classList.add('is-hidden');
    }
    this.trigger.setAttribute('aria-expanded', 'true');
    this.content.setAttribute('aria-hidden', 'false');
    this.trigger.classList.add('is-active');
    this.content.classList.remove('is-hidden');
    this.positionTooltip();
  };

  tooltip.prototype.positionTooltip = function () {
    var targetRect = this.content.getBoundingClientRect();
    var targetWidth = targetRect.width || (targetRect.left - targetRect.right);
    var windowWidth = window.innerWidth;

    // IF tooltip position too big for placement on the right;
    if (windowWidth <= targetRect.left + targetWidth) {
      this.content.classList.add('has-position--left');
      // recalculate its bounds;
      targetRect = this.content.getBoundingClientRect();
      if (window.pageXOffset > targetRect.left) {
        this.content.classList.remove('has-position--left');
        this.content.classList.add('has-position--fixed');
      }
    }
  };

  tooltip.prototype.hideTooltip = function () {
    this.element.setAttribute('aria-expanded', 'false');
    this.element.classList.remove('is-active');
    this.content.classList.add('is-hidden');
    this.content.setAttribute('aria-hidden', 'true');

    this.element.classList.remove('has-position--left');
    this.element.classList.remove('has-position--fixed');
  };

  tooltip.prototype.hideTooltipKeyboard = function (e) {
    if (e.keyCode === '27') {
      this.hideTooltip(e);
    }
  };

  onl.decorate({
    tooltip: function( element ) {
      new tooltip ( element );
    }
  });

})();
