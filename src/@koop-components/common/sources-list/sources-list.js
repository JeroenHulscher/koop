(function () {
  'use strict';

  onl.decorate({
    'init-sourceslist': function (element) {
      new sourceslist(element);
    }
  });

  var sourceslist = function (element) {
    this.element = element;
    this.config = JSON.parse(this.element.getAttribute('data-config')) || [];

    this.triggerClass = this.config.triggerClass || '.js-sourceslist-statetrigger';
    this.triggerConfig = JSON.parse(this.element.getAttribute('data-config')) || [];

    this.stateTriggers = document.querySelectorAll(this.triggerClass);





    // if (this.sourceslist) {


      // this.questionIdTag = this.config.questionIdTag || '#citem-';
      // this.questionContainer = this.config.questionContainer || '.js-form-conditionals__citem';
      // this.submitContainer = this.config.submitContainer || this.element.querySelector('.js-form-conditionals__submitcontainer');
      // this.respondsContainer = this.config.respondsContainer || this.element.querySelector('.js-form-conditionals__responds');
      // this.buttonNextSelector = '.js-button-next';

      // this.questions = this.element.querySelectorAll(this.questionContainer);
      // this.inputs = this.element.querySelectorAll('input,select');
      // this.buttonNexts = this.element.querySelectorAll(this.buttonNextSelector);

      this.initEventListeners();
      // this.setInitialState();

      // this.init();
    // }

  };



  sourceslist.prototype.initEventListeners = function () {
    var y;
    for (y = 0; y < this.stateTriggers.length; y++) {
      this.stateTriggers[y].addEventListener('click', function (e) { this.getTriggerConfig(e); }.bind(this), false);
    }
  };

  sourceslist.prototype.getTriggerConfig = function (e) {
    e.preventDefault();
    var trigger = e.target;
    var triggerDataset = JSON.parse(trigger.dataset.config);
    var state = triggerDataset.state;
    var id = triggerDataset.id;

    this.sourceslist = document.querySelector('#' + id);

    if (this.sourceslist) {
      this.sourceslist.classList.add('is-state-' + state);
      this.sourceslist.setAttribute('role', 'alert');
      this.sourceslist.setAttribute('tabindex', '0');
      this.sourceslist.focus();
      trigger.setAttribute('hidden', 'hidden');
      this.createDiscardLink(trigger);
    }

  };

  sourceslist.prototype.createDiscardLink = function (trigger) {
    var newNode = document.createElement('a');
    var text = document.createTextNode("Annuleren");
    newNode.appendChild(text);
    newNode.href = "#";

    var referenceNode = trigger;
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);

    newNode.addEventListener('click', function (e) { this.reset(e, trigger); }.bind(this), false);
  }

  sourceslist.prototype.reset = function (e, trigger) {
    e.preventDefault();
    e.target.parentNode.removeChild(e.target);
    trigger.removeAttribute('hidden');
    this.sourceslist.classList.remove('is-state-actions');
  }

  // formConditionals.prototype.setInitialState = function () {
  //   var y;
  //   var i;
  //   var firstInput;
  //   var evt;

  //   for (y = 0; y < this.questions.length; y++) {
  //     if (y !== 0) {
  //       this.questions[y].setAttribute('hidden', 'hidden');
  //     }
  //     if (y === 0) {
  //       firstInput = true;
  //     }
  //   }
  //   if (firstInput) {
  //     firstInput = this.questions[0].querySelectorAll('input,select');
  //     if (firstInput[0]) {

  //       if (firstInput[0].tagName === 'SELECT') {
  //         if ('createEvent' in document) {
  //           evt = document.createEvent('HTMLEvents');
  //           evt.initEvent('change', false, true);
  //           firstInput[0].dispatchEvent(evt);
  //         }
  //         else {
  //           firstInput[0].fireEvent('onchange');
  //         }
  //       }
  //       if (firstInput[0].tagName === 'INPUT') {

  //         for (i = 0; i < firstInput.length; i++) {
  //           if (firstInput[i].checked) {
  //             this.actOnChange(firstInput[i]);
  //           }
  //         }
  //       }
  //     }
  //   }
  // };

  // formConditionals.prototype.initEventListeners = function (e) {
  //   var y;
  //   var i;

  //   for (y = 0; y < this.inputs.length; y++) {
  //     this.inputs[y].addEventListener('change', function (e) { this.actOnChange(e); }.bind(this), false);
  //   }
  //   for (i = 0; i < this.buttonNexts.length; i++) {
  //     this.buttonNexts[i].addEventListener('click', function (e) { this.actOnChange(e); }.bind(this), false);
  //   }

  // };

  // formConditionals.prototype.actOnChange = function (e) {
  //   var obj;
  //   var inputType;
  //   var linkedToQuestionId;
  //   var currentQuestionContainer;
  //   var automaticProceed;
  //   var showLast;
  //   var showResponds;
  //   var hideself;

  //   console.log('klik');

  //   if (e.target !== undefined) {
  //     obj = e.target;
  //   } else {
  //     obj = e;
  //   }

  //   inputType = obj.type;
  //   linkedToQuestionId;
  //   currentQuestionContainer = obj.closest(this.questionContainer);
  //   automaticProceed = true;
  //   showLast = obj.getAttribute('data-triggerlaststep');
  //   showResponds = obj.getAttribute('data-triggeresponds');
  //   hideself = obj.getAttribute('data-hideself');

  //   switch (inputType) {
  //     case 'radio':
  //       linkedToQuestionId = obj.getAttribute('data-linkedto');
  //       break;
  //     case 'submit':
  //       linkedToQuestionId = obj.getAttribute('data-linkedto');
  //       break;
  //     case 'button':
  //       linkedToQuestionId = obj.getAttribute('data-linkedto');
  //       break;
  //     case 'input':
  //       linkedToQuestionId = obj.getAttribute('data-linkedto');
  //       break;
  //     case 'select-one':
  //       linkedToQuestionId = obj[obj.selectedIndex].getAttribute('data-linkedto');
  //       break;
  //     case 'checkbox':
  //       if (this.amountCheckedInFamily(obj, currentQuestionContainer) > 0) {
  //         currentQuestionContainer.querySelector(this.buttonNextSelector).removeAttribute('hidden');
  //       } else {
  //         currentQuestionContainer.querySelector(this.buttonNextSelector).setAttribute('hidden', 'hidden');
  //         this.resetFutureQuestions(currentQuestionContainer);
  //       }
  //       automaticProceed = false;
  //       break;
  //   }

  //   if (automaticProceed) {
  //     this.resetFutureQuestions(currentQuestionContainer);

  //     if (linkedToQuestionId) {
  //       this.activateLinkedQuestion(linkedToQuestionId);
  //       this.hideFormSubmit();
  //     } else {
  //       this.showFormSubmit();
  //     }
  //   }

  //   if (showResponds) {
  //     this.showResponds();
  //     this.hideForm();
  //   } else {
  //     if (showLast) {
  //       this.showFormSubmit();
  //     }
  //   }

  //   if (hideself) {
  //     this.hideCurrentQuestion(currentQuestionContainer);
  //   }
  // };

  // formConditionals.prototype.hideCurrentQuestion = function (currentQuestionContainer) {
  //   currentQuestionContainer.setAttribute('hidden', 'hidden');
  // }


  // formConditionals.prototype.amountCheckedInFamily = function (obj, parent) {
  //   var list, index, item, checkedCount;

  //   checkedCount = 0;
  //   list = parent.getElementsByTagName('input');
  //   for (index = 0; index < list.length; ++index) {
  //     item = list[index];
  //     if (item.getAttribute('type') === "checkbox"
  //       && item.checked
  //       && item.name === obj.name) {
  //       ++checkedCount;
  //     }
  //   }
  //   return checkedCount;
  // };

  // formConditionals.prototype.resetFutureQuestions = function (currentQuestionContainer) {
  //   var i;
  //   var y;
  //   var allInputsInQuestion;

  //   // strips #question-{{id}} to {{id}}
  //   currentQuestionContainer = currentQuestionContainer.getAttribute('id');
  //   currentQuestionContainer = currentQuestionContainer.substr(this.questionIdTag.length - 1, 5);

  //   for (i = 0; i < this.questions.length; i++) {

  //     if (this.questions[i].getAttribute('id').substr(this.questionIdTag.length - 1, 5) > currentQuestionContainer) {
  //       allInputsInQuestion = this.questions[i].querySelectorAll('input');

  //       // reset answers
  //       for (y = 0; y < allInputsInQuestion.length; y++) {
  //         var type = allInputsInQuestion[y].getAttribute('type');

  //         if (type === 'radio') {
  //           allInputsInQuestion[y].checked = false;
  //         }
  //       }

  //       // hide question;
  //       this.questions[i].setAttribute('hidden', 'hidden');
  //       this.questions[i].removeAttribute('role');
  //     }
  //   }

  // };

  // formConditionals.prototype.activateLinkedQuestion = function (questionId) {
  //   var self = this;
  //   var nextQuestion = this.element.querySelector(self.questionIdTag + questionId);

  //   if (nextQuestion) {
  //     nextQuestion.removeAttribute('hidden');
  //     nextQuestion.setAttribute('role', 'alert');
  //   }

  // };

  // formConditionals.prototype.showFormSubmit = function () {
  //   if (this.submitContainer) {
  //     this.submitContainer.removeAttribute('hidden');
  //     this.submitContainer.querySelector('button').setAttribute('role', 'alert');
  //   }
  // };
  // formConditionals.prototype.hideFormSubmit = function () {
  //   if (this.submitContainer) {
  //     this.submitContainer.setAttribute('hidden', 'hidden');
  //     this.submitContainer.querySelector('button').removeAttribute('role');
  //   }
  // };

  // formConditionals.prototype.showResponds = function () {
  //   this.respondsContainer.removeAttribute('hidden');
  // };

  // formConditionals.prototype.hideForm = function () {
  //   var y;

  //   for (y = 0; y < this.questions.length; y++) {
  //     this.questions[y].setAttribute('hidden', 'hidden');
  //   }
  //   this.submitContainer.setAttribute('hidden', 'hidden');
  // };

})();
