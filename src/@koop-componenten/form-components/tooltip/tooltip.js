(function () {

  'use strict';

  var tooltip = function( element ) {
    this.element = element;
    this.config = JSON.parse( this.element.getAttribute( 'data-config' ) ) || [];
    this.trigger = this.element.querySelector(this.config.trigger) || this.element.querySelector( '.tooltip__trigger' );
    this.content = this.element.querySelector(this.config.content) || this.element.querySelector( '.tooltip__content' );
    this.content = document.getElementById(this.trigger.getAttribute('aria-describedby'));
    this.init();
  };

  tooltip.prototype.init = function( ) {
    var self = this;
    if(onl.ui.isTouch()){
      this.trigger.addEventListener('click', function (e) { this.showTooltip('click'); e.preventDefault(); }.bind(this), false);
      this.createCloseButton();
    } else {
      this.content.addEventListener('mouseover', function (e) { this.clearTimeoutTooltip(); }.bind(this), false);
      this.content.addEventListener('mouseout', function (e) { this.timeoutTooltip(); }.bind(this), false);
      this.trigger.addEventListener('mouseover', function (e) { this.showTooltip(e); }.bind(this), false);
      this.trigger.addEventListener('focus', function (e) { this.showTooltip(e); }.bind(this), false);
      this.trigger.addEventListener('keyup', function (e) { this.hideTooltipKeyboard(e); }.bind(this), false);
      this.trigger.addEventListener('mouseout', function (e) { this.timeoutTooltip(e); }.bind(this), false);
      this.trigger.addEventListener('blur', function (e) { this.timeoutTooltip(e); }.bind(this), false);
      this.content.addEventListener('click', function (e) { this.showTooltip(e); }.bind(this), false);
      this.trigger.addEventListener('click', function (e) { this.showTooltip(e); e.preventDefault(); }.bind(this), false);
      this.trigger.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') {
          self.hideTooltip();
        }
      });

      this.content.addEventListener('mouseenter', function(element) {
        self.mouseOverTooltip = true;
      });
      this.content.addEventListener('mouseleave', function(element) {
        self.mouseOverTooltip = false;
        self.timeoutTooltip();
      });



    }
    

    
  };

  tooltip.prototype.createCloseButton = function () {
    var self = this;

    this.closeButton = document.createElement('button');
    this.closeButton.classList.add('tooltip__close');
    this.closeButton.innerHTML = '<span class="visually-hidden">Tooltip </span>Sluiten';
    this.content.appendChild(this.closeButton);
    this.closeButton.addEventListener('click', function (event) {
      event.preventDefault();
      self.hideTooltip('closebutton');
    });
    // this.closeButton.addEventListener('focus', (event) => {
    //   self.clearTimeoutTooltip();
    // });
    // this.closeButton.addEventListener('blur', (event) => {
    //   self.timeoutTooltip();
    // });
  }

 
  
  tooltip.prototype.showTooltip = function (sourceEvent) {
    var all = document.querySelectorAll('.tooltip__content');
    var i;

    for (i = 0; i < all.length; i++) {
      all[i].setAttribute('aria-hidden', 'true');
      all[i].classList.add('is-hidden');
    }
    this.trigger.setAttribute('aria-expanded', 'true');
    this.trigger.classList.add('is-active');
    this.content.setAttribute('aria-hidden', 'false');
    this.content.classList.remove('is-hidden');
    
    if(sourceEvent === 'click') {
      this.trigger.classList.add('is-clicked');
      return;
    }

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

  tooltip.prototype.timeoutTooltip = function () {
    var self = this;
    this.timeoutHide = window.setTimeout(function() {
      if(!self.mouseOverTooltip){
        self.hideTooltip();
      }
    }, 300);
  }

  tooltip.prototype.clearTimeoutTooltip = function () {
      window.clearTimeout(this.timeoutHide);
  }

  tooltip.prototype.hideTooltip = function (sourceEvent) {
    // if(!this.trigger.classList.contains('is-clicked') || sourceEvent === 'closebutton') {
      this.element.setAttribute('aria-expanded', 'false');
      this.element.classList.remove('is-active');
      this.element.classList.remove('has-position--left');
      this.element.classList.remove('has-position--fixed');

      this.content.classList.add('is-hidden');
      this.content.setAttribute('aria-hidden', 'true');
    // }
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
