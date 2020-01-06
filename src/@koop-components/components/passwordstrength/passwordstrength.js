(function () {
  'use strict';

  onl.decorate({
    'init-passwordstrength': function (element) {
      new passwordstrength(element);
    }
  });

  var passwordstrength = function (element) {
    this.element = element;
    this.config = JSON.parse(this.element.getAttribute('data-config')) || [];
    this.fieldPassword = this.config.fieldPassword || '.js-passwordstrength__input';
    this.fieldPassword = this.element.querySelector(this.fieldPassword);
    this.fieldPasswordRepeat = this.config.fieldPasswordRepeat || '.js-passwordstrength__inputrepeat';
    this.fieldPasswordRepeat = this.element.querySelector(this.fieldPasswordRepeat);

    this.regexContainer = document.querySelector('.js-passwordstrength__regexcontainer');
    this.regexs = document.querySelectorAll('[data-regex]');
    this.initEventListeners();
  };

  passwordstrength.prototype.initEventListeners = function() {
    if (this.fieldPassword){
      this.fieldPassword.addEventListener('keyup', function(e) { this.validateField(e); }.bind(this), false);
    }
    if (this.fieldPasswordRepeat){
      this.fieldPasswordRepeat.addEventListener('keyup', function(e) { this.validateFieldRepeat(e); }.bind(this), false);
    }
  };

  passwordstrength.prototype.validateField = function() {
    var i;
    var regexFormula;
    var totalCorrect = 0;

    // reset actives;
    for (i = 0; i < this.regexs.length; i++) {
      this.regexs[i].classList.remove('is-active');
      this.regexContainer.setAttribute('role', '');
    }

    for (i = 0; i < this.regexs.length; i++) {
      regexFormula = new RegExp('^' + this.regexs[i].dataset.regex);
      if (regexFormula.test(this.fieldPassword.value)){
        this.regexs[i].classList.add('is-active');
        totalCorrect++;
        this.regexContainer.setAttribute('role', 'alert');
      }
    }

    if (totalCorrect === this.regexs.length) {
      this.fieldPassword.classList.add('is-valid');
    }

    if (this.fieldPasswordRepeat) {
      if (this.fieldPasswordRepeat.value !== ''){
        this.validateFieldRepeat();
      }
    }

  };

  passwordstrength.prototype.validateFieldRepeat = function() {
    var fieldRepeat = this.fieldPasswordRepeat.value;
    var field = this.fieldPassword.value;

    if (field !== fieldRepeat) {
      this.showError(this.fieldPasswordRepeat);
    } else {
      this.removeError(this.fieldPasswordRepeat);
      if (this.fieldPassword.classList.contains('is-valid')){
        this.fieldPasswordRepeat.classList.add('is-valid');
      }
    }
  };

  passwordstrength.prototype.showError = function (field) {
    field.nextElementSibling.removeAttribute('hidden');
  }
  passwordstrength.prototype.removeError = function (field) {
    field.nextElementSibling.setAttribute('hidden', 'hidden');
  }


})();
