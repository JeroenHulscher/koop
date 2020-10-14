(function () {
  'use strict';

  onl.decorate({
    'init-accordion': function (element) {
      new accordion(element);
    }
  });

  var accordion = function (element) {
    this.element = element;
    this.config = JSON.parse(this.element.getAttribute('data-config')) || [];

    this.allowMultiplePanelsOpen = this.config.allowMultiplePanelsOpen || true;
    this.allowToggle = this.config.allowToggle || true;

    this.accordionHeaderClass = this.config.accordionHeaderClass || 'accordion__item__header';
    this.triggerClass = this.config.triggerClass || 'accordion__item__header-trigger';
    this.checkboxTriggerClass = this.config.checkboxTriggerClass || 'accordion__item__header-checkboxtrigger';

    this.triggers = this.element.querySelectorAll('.' + this.triggerClass);
    this.checkboxTriggers = this.element.querySelectorAll('.' + this.checkboxTriggerClass);
    console.log('this.checkboxTriggers', this.checkboxTriggers);

    this.init();
    this.initEventListeners();

  };

  accordion.prototype.init = function () {
    if (!this.allowToggle) {
      var expanded = this.element.querySelector('[aria-expanded="true"]');
      if (expanded) {
        expanded.setAttribute('aria-disabled', 'true');
      }
    }
  };

  accordion.prototype.initEventListeners = function () {
    var i;
    var y;

    for (y = 0; y < this.checkboxTriggers.length; y++) {
      this.checkboxTriggers[y].addEventListener('click', function (e) { this.doCheckboxTriggerAction(e); }.bind(this), false);

      // open item when checkbox is checked;
      if (this.checkboxTriggers[y].checked) {
        this.doCheckboxTriggerAction(this.checkboxTriggers[y]);
      }
    }

    for (i = 0; i < this.triggers.length; i++) {
      this.triggers[i].addEventListener('click', function (e) { this.doTriggerAction(e); }.bind(this), false);
      // this.triggers[i].addEventListener('focus', function () { this.element.classList.add('is-focused'); }.bind(this), false);
      // this.triggers[i].addEventListener('blur', function () { this.element.classList.remove('is-focused'); }.bind(this), false);
    }
  };

  accordion.prototype.doCheckboxTriggerAction = function (e) {
    console.log('e', e);
    console.log('in', e.target);
    console.log('in', e.target.classList);
    console.log('in', e.target.classList.contains(this.checkboxTriggerClass));
    function findAncestor(el, cls) {
      while ((el = el.parentElement) && !el.classList.contains(cls));
      return el;
    }

    // var header = findAncestor(e, this.accordionHeaderClass);
    // var trigger = header.querySelector('.' + this.triggerClass);
    // if (trigger) {
      // var isExpanded = trigger.getAttribute('aria-expanded') == 'true';
      // if(isExpanded) {
        this.doTriggerAction(e, 'checkbox');
      // }
    // }

  }

  accordion.prototype.doTriggerAction = function (e, type) {
    // console.log('doTriggerAction', e);
    // console.log('doTriggerAction', e.target);
    var trigger = e.target;
    var triggerClass;
    if(type === "checkbox") {
      triggerClass = this.checkboxTriggerClass;
    } else {
      triggerClass = this.triggerClass;
    }

    console.log('e', e);
    console.log('in', e.target);
    console.log('in', e.target.classList);
    console.log('in', e.target.classList.contains(triggerClass));
    console.log('in trigger', trigger.classList.contains(triggerClass));



    function findAncestor(el, cls) {
      while ((el = el.parentElement) && !el.classList.contains(cls));
      return el;
    }
    if (type != "checkbox") {
      if (!trigger.classList.contains(this.triggerClass)) {
        trigger = findAncestor(trigger, this.triggerClass);
      }
    }
    if (trigger.classList.contains(triggerClass)) {
      var isExpanded = trigger.getAttribute('aria-expanded') == 'true';
      var activePanel = this.element.querySelector('[aria-expanded="true"]');

      // close open panel, if there is any.
      if (activePanel && activePanel !== trigger && !this.allowMultiplePanelsOpen) {
        activePanel.setAttribute('aria-expanded', 'false');
        document.getElementById(activePanel.getAttribute('aria-controls')).setAttribute('aria-hidden', 'true');

        if (!this.allowToggle) {
          trigger.setAttribute('aria-disabled', 'true');
        }
      }

      // if item is closed, open it.
      if (!isExpanded) {
        trigger.setAttribute('aria-expanded', 'true');
        document.getElementById(trigger.getAttribute('aria-controls')).setAttribute('aria-hidden','false');

        if (!this.allowToggle) {
          trigger.setAttribute('aria-disabled', 'true');
        }
      }
      // close it again, if it's open and allowed to toggle
      else if (this.allowToggle && isExpanded) {
        trigger.setAttribute('aria-expanded', 'false');
        document.getElementById(trigger.getAttribute('aria-controls')).setAttribute('aria-hidden', 'true');
      }
    }

    if (type === "checkbox") {
      return false;
    } else {
      e.preventDefault();
    }
  };

})();
