(function () {
  'use strict';

  onl.decorate({
    'init-form-conditionals': function (element) {
      new formConditionals(element);
    }
  });

  var formConditionals = function (element) {
    this.element = element;
    this.config = JSON.parse(this.element.getAttribute('data-config')) || [];

    this.questionIdTag = this.config.questionIdTag || '#citem-';
    this.questionContainer = this.config.questionContainer || '.js-form-conditionals__citem';
    this.submitContainer = this.config.submitContainer || this.element.querySelector('.js-form-conditionals__submitcontainer');
    this.respondsContainer = this.config.respondsContainer || this.element.querySelector('.js-form-conditionals__responds');
    this.buttonNextSelector = '.js-button-next';

    this.questions = this.element.querySelectorAll(this.questionContainer);
    this.inputs = this.element.querySelectorAll('input,select');
    this.buttonNexts = this.element.querySelectorAll(this.buttonNextSelector);

    this.initEventListeners();
    this.setInitialState();

  };

  formConditionals.prototype.setInitialState = function() {
    var y;
    var firstInput;

    for (y = 0; y < this.questions.length; y++) {
      if (y !== 0) {
        this.questions[y].setAttribute('hidden', 'hidden');
      }
      if (y === 0) {
        firstInput = true;
      }
    }
    if (firstInput) {
      firstInput = this.questions[0].querySelectorAll('input,select');
      if (firstInput[0]) {
        if (firstInput[0].tagName === 'SELECT') {
          if ("createEvent" in document) {
            var evt = document.createEvent("HTMLEvents");
            evt.initEvent("change", false, true);
            firstInput[0].dispatchEvent(evt);
          }
          else {
            firstInput[0].fireEvent("onchange");
          }
        }
      }
    }
  };

  formConditionals.prototype.initEventListeners = function(e) {
    var y;
    var i;

    for (y = 0; y < this.inputs.length; y++) {
      this.inputs[y].addEventListener('change', function(e) { this.actOnChange(e); }.bind(this), false);
    }
    for (i = 0; i < this.buttonNexts.length; i++) {
      this.buttonNexts[i].addEventListener('click', function (e) { this.actOnChange(e); }.bind(this), false);
    }

  };

  formConditionals.prototype.actOnChange = function(e) {
    var obj = e.target;
    var inputType = obj.type;
    var linkedToQuestionId;
    var currentQuestionContainer = obj.closest(this.questionContainer);
    var automaticProceed = true;
    var showLast = obj.getAttribute('data-triggerlaststep');
    var showResponds = obj.getAttribute('data-triggeresponds');

    switch (inputType) {
    case 'radio':
      linkedToQuestionId = obj.getAttribute('data-linkedto');
      break;
    case 'submit':
      linkedToQuestionId = obj.getAttribute('data-linkedto');
      break;
    case 'button':
      linkedToQuestionId = obj.getAttribute('data-linkedto');
      break;
    case 'input':
      linkedToQuestionId = obj.getAttribute('data-linkedto');
      break;
    case 'select-one':
      linkedToQuestionId = obj[obj.selectedIndex].getAttribute('data-linkedto');
      break;
    case 'checkbox':
      if (this.amountCheckedInFamily(obj, currentQuestionContainer) > 0) {
        currentQuestionContainer.querySelector(this.buttonNextSelector).removeAttribute('hidden');
      } else {
        currentQuestionContainer.querySelector(this.buttonNextSelector).setAttribute('hidden', 'hidden');
        this.resetFutureQuestions(currentQuestionContainer);
      }
      automaticProceed = false;
      break;
    }

    if (automaticProceed) {
      this.resetFutureQuestions(currentQuestionContainer);

      if (linkedToQuestionId) {
        this.activateLinkedQuestion(linkedToQuestionId);
        this.hideFormSubmit();
      } else {
        this.showFormSubmit();
      }
    }

    if (showResponds) {
      this.showResponds();
      this.hideForm();
    } else {
      if (showLast) {
        this.showFormSubmit();
      }
    }
  };

  formConditionals.prototype.amountCheckedInFamily = function(obj, parent) {
    var list, index, item, checkedCount;

    checkedCount = 0;
    list = parent.getElementsByTagName('input');
    for (index = 0; index < list.length; ++index) {
      item = list[index];
      if (item.getAttribute('type') === "checkbox"
        && item.checked
        && item.name === obj.name) {
        ++checkedCount;
      }
    }
    return checkedCount;
  };

  formConditionals.prototype.resetFutureQuestions = function(currentQuestionContainer) {
    var i;
    var y;
    var allInputsInQuestion;

    // strips #question-{{id}} to {{id}}
    currentQuestionContainer = currentQuestionContainer.getAttribute('id');
    currentQuestionContainer = currentQuestionContainer.substr(this.questionIdTag.length - 1, 5);

    for (i = 0; i < this.questions.length; i++) {

      if (this.questions[i].getAttribute('id').substr(this.questionIdTag.length - 1, 5) > currentQuestionContainer) {
        allInputsInQuestion = this.questions[i].querySelectorAll('input');

        // reset answers
        for (y = 0; y < allInputsInQuestion.length; y++) {
          var type = allInputsInQuestion[y].getAttribute('type');

          if (type === 'radio') {
            allInputsInQuestion[y].checked = false;
          }
        }

        // hide question;
        this.questions[i].setAttribute('hidden', 'hidden');
        this.questions[i].removeAttribute('role');
      }
    }

  };

  formConditionals.prototype.activateLinkedQuestion = function(questionId) {
    var self = this;
    var nextQuestion = this.element.querySelector(self.questionIdTag + questionId);
    if (nextQuestion){
      nextQuestion.removeAttribute('hidden');
      nextQuestion.setAttribute('role', 'alert');
    }
  };

  formConditionals.prototype.showFormSubmit = function() {
    if (this.submitContainer){
      this.submitContainer.removeAttribute('hidden');
      this.submitContainer.querySelector('button').setAttribute('role', 'alert');
    }
  };
  formConditionals.prototype.hideFormSubmit = function() {
    if (this.submitContainer){
      this.submitContainer.setAttribute('hidden', 'hidden');
      this.submitContainer.querySelector('button').removeAttribute('role');
    }
  };

  formConditionals.prototype.showResponds = function() {
    this.respondsContainer.removeAttribute('hidden');
  };
  formConditionals.prototype.hideForm = function () {
    var y;

    for (y = 0; y < this.questions.length; y++) {
      this.questions[y].setAttribute('hidden', 'hidden');
    }
    this.submitContainer.setAttribute('hidden', 'hidden');
  };

})();
