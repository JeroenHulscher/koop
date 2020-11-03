(function () {
  'use strict';

  onl.decorate({
    'init-flyoutbar': function (element) {
      new flyoutbar(element);
    }
  });

  var flyoutbar = function (element) {
    this.element = element;
    this.config = JSON.parse(this.element.getAttribute('data-config')) || [];

    this.links = this.element.querySelectorAll('.flyoutbar__nav__item__link');
    this.triggers = this.element.querySelectorAll('.flyoutbar__nav__item__link[role="button"]');

    this.initEventListeners();
    this.init();
  };

  flyoutbar.prototype.init = function () {

  };

  flyoutbar.prototype.initEventListeners = function () {
    var i;
    var self = this;

    for (i = 0; i < this.triggers.length; i++) {
      this.triggers[i].addEventListener('click', function (e) { this.doTriggerAction(e); }.bind(this), false);
    }

    document.addEventListener('click', function (event) {
      var isClickInside = self.element.contains(event.target);
      if (!isClickInside) {
        self.closeFoldout();
      }
    });
    window.onkeyup = function (event) {
      if (event.keyCode == 27) {
        self.closeFoldout();
      }
    }
  };

  flyoutbar.prototype.doTriggerAction = function (e) {
    var el = e.target;
    var i;



    if(el.getAttribute('aria-expanded') === "true") {
      this.closeFoldout(el);
    } else {
      for (i = 0; i < this.links.length; i++) {
        if (this.links[i].hasAttribute('aria-expanded')) {
          this.links[i].setAttribute('aria-expanded', false);
        }
      }
      this.openFoldout(el);

    }

    e.preventDefault();
  }

  flyoutbar.prototype.openFoldout = function (el) {
    el.setAttribute('aria-expanded', "true");
  };
  flyoutbar.prototype.closeFoldout = function (el) {
    var i;

    if(!el) {
      for (i = 0; i < this.links.length; i++) {
        if (this.links[i].hasAttribute('aria-expanded')) {
          this.links[i].setAttribute('aria-expanded', false);
        }
      }
    } else {
      el.setAttribute('aria-expanded', "false");
    }
  };

})();
