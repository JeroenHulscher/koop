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

    this.initEventListeners();

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
    newNode.classList.add('button');
    newNode.classList.add('button--secondary');
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

})();
