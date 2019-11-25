(function () {

  'use strict';

  onl.decorate({

    'init-form-subselection': function (element) {
      new formSubselection(element);
    }

  });

  var formSubselection = function( element ) {
    this.element = element;
    this.config = JSON.parse( this.element.getAttribute( 'data-config' ) ) || [];
    this.config.type = this.config.type || 'span';
    this.config.maxShow = this.config.maxShow || false;
    this.triggerClassDefault = 'icon--list';
    this.triggerClassActive = 'icon--edit';
    this.init();
  };

  formSubselection.prototype.init = function() {
    this.trigger = onl.dom.$( '.subselection__trigger', this.element )[0];
    this.trigger.classList.add(this.triggerClassDefault);
    this.triggerOnLoadText = this.trigger.innerText;
    this.containerSummary = onl.dom.$( '.subselection__summary', this.element )[0];
    this.buttonClose = onl.dom.$( '[data-handler="close-modal"]', this.element );
    this.options = onl.dom.$( 'input[type=checkbox], input[type=radio]', this.element );

    this.items = [];

    this.attachListeners();

    this.collectValues();
    this.parseSelectedOptions();
  };

  formSubselection.prototype.attachListeners = function() {
    var y;

    // for ( i = 0; i < this.buttonClose.length; i++ ) {
    //   this.buttonClose[i].addEventListener( 'click', function (e) { this.parseSelectedOptions(e); }.bind(this), false);
    // }

    for ( y = 0; y < this.options.length; y++ ) {
      this.options[y].addEventListener( 'change', function (e) { this.collectValues(e); }.bind(this), false);
    }
  };

  formSubselection.prototype.collectValues = function() {
    var y;
    var option;
    var value;

    // reset items;
    this.items = [];

    // loop through all checkbox's and add to array;
    for ( y = 0; y < this.options.length; y++ ) {
      option = [];
      if ( this.options[y].checked ) {
        value = this.options[y].getAttribute( 'data-value' ) || this.options[y].value;
        if (this.options[y].closest('label') !== null) {
          option.push(value, this.options[y].closest('label').innerText);
        } else {
          if (this.options[y].closest('.input-checkbox')) {
            option.push(value, this.options[y].closest('.input-checkbox').querySelector('label').innerText);
          } else {
            option.push(value, this.options[y].closest('.input-radio').querySelector('label').innerText);
          }

        }
        if (!this.options[y].classList.contains('js-checkbox-master')) {
          this.items.push(option);
        }
      }
    }
    this.parseSelectedOptions();
  };

  formSubselection.prototype.parseSelectedOptions = function() {
    var y;
    var summary = '';

    for ( y = 0; y < this.items.length; y++ ) {
      summary += '<' + this.config.type + ' title="' + this.items[y][1] + '">' + this.items[y][0] + '</' + this.config.type +'> ';
    }
    this.containerSummary.innerHTML = summary;
    this.containerSummary.setAttribute('aria-live', 'polite');

    this.updateTriggerLabel(this.items.length);
    if (this.config.maxShow) {
      this.initHideUnwantedResults();
    }
  };

  formSubselection.prototype.initHideUnwantedResults = function () {
    this.resultItems = [].slice.call(this.element.querySelectorAll(this.config.type));
    this.config.labelMore = this.config.labelmore || 'Toon meer';
    this.config.labelLess = this.config.labelless || 'Toon minder';
    this.allvisible = false;
    this.hideUnwantedResults(true);
  };

  formSubselection.prototype.hideUnwantedResults = function (createTrigger) {
    var i;
    var y = 0;

    for (i = 0; i < this.resultItems.length; i++ ) {
      if ( i > this.config.maxShow - 1 ) {
        this.resultItems[i].setAttribute('hidden', 'true');
        this.resultItems[i].setAttribute('aria-hidden', 'true');
        y++;
      }
    }
    this.totalHidden = y;
    if ( createTrigger && i > this.config.maxShow) {
      this.addShowMoreTrigger();
    }
  };

  formSubselection.prototype.addShowMoreTrigger = function () {
    this.trigger = document.createElement('div');
    this.trigger.classList.add('link');
    this.trigger.classList.add('link--down');

    this.triggerA = document.createElement('a');
    this.triggerA.setAttribute('href', '#');
    this.triggerA.setAttribute('tabindex', '0');
    this.triggerA.setAttribute('aria-expanded', false);
    this.triggerA.innerHTML = 'Toon meer' + ' (' + this.totalHidden + ')';

    this.trigger.appendChild(this.triggerA);


    this.containerSummary.appendChild(this.trigger);

    this.triggerA.addEventListener('click', function (e) { e.preventDefault(); this.showHide(e); }.bind(this), false);
  };

  formSubselection.prototype.showHide = function () {
    var i;
    if (this.allvisible) {
      this.hideUnwantedResults();
      this.allvisible = false;
      this.trigger.classList.remove('link--up');
      this.trigger.classList.add('link--down');
      this.triggerA.innerHTML = this.config.labelMore + ' (' + this.totalHidden + ')';
      this.triggerA.setAttribute('aria-expanded', false);
    } else {
      for (i = 0; i < this.resultItems.length; i++) {
        this.resultItems[i].removeAttribute('hidden', 'true');
        this.resultItems[i].removeAttribute('aria-hidden', 'true');
      }
      this.allvisible = true;
      this.trigger.classList.add('link--up');
      this.trigger.classList.remove('link--down');
      this.triggerA.innerHTML = this.config.labelLess;
      this.triggerA.setAttribute('aria-expanded', true);
    }
  };

  formSubselection.prototype.updateTriggerLabel = function (length) {
    // no idea why, but re-init is needed for this var;
    this.trigger = onl.dom.$( '.subselection__trigger', this.element )[0];

    if ( length > 0 ) {
      this.trigger.innerText = this.config.triggerOnChangeText || 'Aanpassen';
      this.trigger.classList.remove(this.triggerClassDefault);
      this.trigger.classList.add(this.triggerClassActive);
    } else {
      this.trigger.innerText = this.triggerOnLoadText;
      this.trigger.classList.remove(this.triggerClassActive);
      this.trigger.classList.add(this.triggerClassDefault);
    }
  };

})();
