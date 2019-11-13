(function () {
  'use strict';

  onl.decorate({
    'init-questionnaire': function (element) {
      new questionnaire(element);
    }
  });

  var questionnaire = function (element) {
    this.element = element;
    this.config = JSON.parse(this.element.getAttribute('data-config')) || [];

    this.questionIdTag = this.config.questionIdTag || '#question-';
    this.questionContainer = this.config.questionContainer || '.js-questionnaire__question';
    this.submitContainer = this.config.submitContainer || this.element.querySelector('.js-questionnaire__submitcontainer');
    this.buttonNextSelector = '.js-button-next';

    this.questions = this.element.querySelectorAll(this.questionContainer);
    this.inputs = this.element.querySelectorAll('input,select');
    this.buttonNexts = this.element.querySelectorAll(this.buttonNextSelector);

    this.setInitialState();
    this.initEventListeners();
  };

  questionnaire.prototype.setInitialState = function() {
    var y;

    for (y = 0; y < this.questions.length; y++) {
      if (y !== 0) {
        this.questions[y].setAttribute('hidden', 'hidden');
      }
    }
  };

  questionnaire.prototype.initEventListeners = function(e) {
    var y;
    var i;

    for (y = 0; y < this.inputs.length; y++) {
      this.inputs[y].addEventListener('change', function(e) { this.actOnChange(e); }.bind(this), false);
    }
    for (i = 0; i < this.buttonNexts.length; i++) {
      this.buttonNexts[i].addEventListener('click', function (e) { this.actOnChange(e); }.bind(this), false);
    }



  };

  questionnaire.prototype.actOnChange = function(e) {
    var obj = e.path[0];
    var inputType = obj.type;
    var linkedToQuestionId;
    var currentQuestionContainer = obj.closest('fieldset');
    var automaticProceed = true;
    console.log('inputType', inputType);

    switch (inputType) {
    case 'radio':
      linkedToQuestionId = obj.dataset.linkedto;
      break;
    case 'submit':
      linkedToQuestionId = obj.dataset.linkedto;
      break;
    case 'select-one':
      console.log('select');
      linkedToQuestionId = obj.options[obj.selectedIndex].getAttribute('data-linkedto');
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
  };

  questionnaire.prototype.amountCheckedInFamily = function(obj, parent) {
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

  questionnaire.prototype.resetFutureQuestions = function(currentQuestionContainer) {
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

  questionnaire.prototype.activateLinkedQuestion = function(questionId) {
    var self = this;
    var nextQuestion = this.element.querySelector(self.questionIdTag + questionId);

    if (nextQuestion){
      nextQuestion.removeAttribute('hidden');
      nextQuestion.setAttribute('role', 'alert');
    }
  };

  questionnaire.prototype.showFormSubmit = function() {
    this.submitContainer.removeAttribute('hidden');
    this.submitContainer.querySelector('button').setAttribute('role', 'alert');
  };
  questionnaire.prototype.hideFormSubmit = function() {
    this.submitContainer.setAttribute('hidden', 'hidden');
    this.submitContainer.querySelector('button').removeAttribute('role');
  };

})();
