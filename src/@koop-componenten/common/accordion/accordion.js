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

    if (this.config.allowMultiplePanelsOpen === false) {
      this.allowMultiplePanelsOpen = this.config.allowMultiplePanelsOpen;
    } else {
      this.allowMultiplePanelsOpen = true;
    }

    this.allowToggle = this.config.allowToggle || true;

    this.accordionHeaderClass = this.config.accordionHeaderClass || 'accordion__item__header';
    this.triggerClass = this.config.triggerClass || 'accordion__item__header-trigger';
    this.checkboxTriggerClass = this.config.checkboxTriggerClass || 'accordion__item__header-checkboxtrigger';

    this.triggers = this.element.querySelectorAll('.' + this.triggerClass);
    this.checkboxTriggers = this.element.querySelectorAll('.' + this.checkboxTriggerClass);

    this.init();
    this.initEventListeners();
    this.readHashForActions();

  };

  accordion.prototype.init = function () {
    if (!this.allowToggle) {
      var expanded = this.element.querySelector('[aria-checked="true"]');
      if (expanded) {
        expanded.setAttribute('aria-disabled', 'true');
      }
    }
  };

  accordion.prototype.initEventListeners = function () {
    var i;
    var y;

    for (y = 0; y < this.checkboxTriggers.length; y++) {
      this.checkboxTriggers[y].addEventListener('change', function (e) { this.doCheckboxTriggerAction(e); }.bind(this), false);

      // open item when checkbox is checked;
      if (this.checkboxTriggers[y].checked) {
        this.doCheckboxTriggerAction(this.checkboxTriggers[y], true);
      }
    }

    for (i = 0; i < this.triggers.length; i++) {
      this.triggers[i].addEventListener('click', function (e) { this.doTriggerAction(e); }.bind(this), false);
      // this.triggers[i].addEventListener('focus', function () { this.element.classList.add('is-focused'); }.bind(this), false);
      // this.triggers[i].addEventListener('blur', function () { this.element.classList.remove('is-focused'); }.bind(this), false);
    }
  };

  accordion.prototype.readHashForActions = function (e) {
    var hash = window.location.hash.substr(1);

    // is accordion? then open the item;
    var el = document.querySelector('#'+hash);
    if(el.classList.contains('accordion__item')){
      var trigger = el.querySelector('.accordion__item__header-trigger');
      if(trigger) {
        trigger.click();
      }
    }
  }

  accordion.prototype.doCheckboxTriggerAction = function (e, onpageloud) {
    this.doTriggerAction(e, 'checkbox', onpageloud);
  }

  accordion.prototype.doTriggerAction = function (e, type, onpageloud) {
    var trigger;
    var triggerClass;
    var ariaType;

    if(e.target) {
      trigger = e.target;
    } else {
      trigger = e;
    }

    if(type === "checkbox") {
      triggerClass = this.checkboxTriggerClass;
      ariaType = 'aria-checked';
    } else {
      ariaType = 'aria-expanded';
      triggerClass = this.triggerClass;
    }


    function findAncestor(el, cls) {
      while ((el = el.parentElement) && !el.classList.contains(cls));
      return el;
    }
    if (type != "checkbox") {
      if (!trigger.classList.contains(triggerClass)) {
        trigger = findAncestor(trigger, triggerClass);
      }
    }
    if (trigger.classList.contains(triggerClass)) {
      var isExpanded = trigger.getAttribute(ariaType) == 'true';
      var activePanel = this.element.querySelector('[' + ariaType + '="true"]');

      if (!onpageloud) {
        // close open panel, if there is any.
        if (activePanel && activePanel !== trigger && !this.allowMultiplePanelsOpen) {
          activePanel.setAttribute(ariaType, 'false');
          document.getElementById(activePanel.getAttribute('aria-controls')).setAttribute('aria-hidden', 'true');

          if (!this.allowToggle) {
            trigger.setAttribute('aria-disabled', 'true');
          }
        }


        // if item is closed, open it.
        if (!isExpanded) {
          trigger.setAttribute(ariaType, 'true');
          document.getElementById(trigger.getAttribute('aria-controls')).setAttribute('aria-hidden','false');

          if (!this.allowToggle) {
            trigger.setAttribute('aria-disabled', 'true');
          }
        }
        // close it again, if it's open and allowed to toggle
        else if (this.allowToggle && isExpanded) {
          trigger.setAttribute(ariaType, 'false');
          document.getElementById(trigger.getAttribute('aria-controls')).setAttribute('aria-hidden', 'true');
        }
      } else {
        document.getElementById(trigger.getAttribute('aria-controls')).setAttribute('aria-hidden', 'false');
      }

    }

    if (type === "checkbox") {
      return false;
    } else {
      e.preventDefault();
    }
  };

})();
