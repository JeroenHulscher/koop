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
    this.createNavButton();
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

  flyoutbar.prototype.createNavButton = function () {
    var nav = this.element.querySelector('.flyoutbar__nav');

    this.navButton = document.createElement('button');
    this.navButton.classList.add('flyoutbar__navbutton');

    this.navButton.setAttribute('aria-expanded', false);
    this.navButton.setAttribute('aria-haspopup', true);
    this.navButton.setAttribute('aria-controls', nav.getAttribute('id'));
    this.navButton.setAttribute('id', 'flyoutbar__navbutton-' + nav.getAttribute('id'));
    this.navButton.innerHTML = this.config.labelNavButton || "menu";

    nav.setAttribute('aria-labelledby', this.navButton.getAttribute('id'));

    nav.parentNode.insertBefore(this.navButton, nav);

    this.navButton.addEventListener('click', function (e) { e.preventDefault(); this.toggleNav(e); }.bind(this), false);
  };

  flyoutbar.prototype.toggleNav = function () {

    if (this.element.classList.contains('is-open')){
      this.element.classList.remove('is-open');
      this.navButton.setAttribute('aria-expanded', false);
      this.navButton.innerHTML = 'menu';
    } else {
      this.element.classList.add('is-open');
      this.navButton.innerHTML = 'sluiten';
      this.navButton.setAttribute('aria-expanded', true);
    }
  }

})();
