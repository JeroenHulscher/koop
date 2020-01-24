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
    this.fieldPasswordRepeat = document.querySelector(this.fieldPasswordRepeat);
    this.regexContainer = this.element.querySelector('.js-passwordstrength__regexcontainer > div');
    this.regexs = this.regexContainer.querySelectorAll('[data-regex]');

    this.duplicateRegexContainer = document.querySelector('.js-passwordstrength__duplicateregexcontainer');
    if (this.duplicateRegexContainer){
      this.makeDuplicateRegexContainer();
    }
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

  passwordstrength.prototype.makeDuplicateRegexContainer = function() {
    this.duplicateRegexContainer.innerHTML = '';
    var duplicate = this.regexContainer.cloneNode(true);
    this.duplicateRegexContainer.appendChild(duplicate);
  }

  passwordstrength.prototype.validateField = function() {
    var i;
    var regexFormula;
    var totalCorrect = 0;
    var self = this;

    // reset actives;
    for (i = 0; i < this.regexs.length; i++) {
      this.regexs[i].classList.remove('is-active');
      this.regexContainer.setAttribute('role', '');
    }

    for (i = 0; i < this.regexs.length; i++) {
      regexFormula = new RegExp(this.regexs[i].dataset.regex);

      if (regexFormula.test(this.fieldPassword.value)){
        this.regexs[i].classList.add('is-active');
        totalCorrect++;
        this.regexContainer.setAttribute('role', 'alert');
      }
    }

    if (totalCorrect === this.regexs.length) {
      this.fieldPassword.classList.add('is-valid');
    } else {
      this.fieldPassword.classList.remove('is-valid');
    }

    if (this.fieldPasswordRepeat) {
      if (this.fieldPasswordRepeat.value !== ''){
        this.validateFieldRepeat();
      }
    }

    this.makeDuplicateRegexContainer();

  };

  passwordstrength.prototype.validateFieldRepeat = function() {
    var fieldRepeat = this.fieldPasswordRepeat.value;
    var field = this.fieldPassword.value;

    if (field !== fieldRepeat) {
      this.showError(this.fieldPasswordRepeat);
      this.fieldPasswordRepeat.classList.remove('is-valid');
    } else {
      this.removeError(this.fieldPasswordRepeat);
      if (this.fieldPassword.classList.contains('is-valid')){
        this.fieldPasswordRepeat.classList.add('is-valid');
      }
    }
  };

  passwordstrength.prototype.showError = function (field) {
    if (field.nextElementSibling){
      field.nextElementSibling.removeAttribute('hidden');
    }
  }
  passwordstrength.prototype.removeError = function (field) {
    if (field.nextElementSibling) {
      field.nextElementSibling.setAttribute('hidden', 'hidden');
    }
  }


})();
