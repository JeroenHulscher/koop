

(function () {

  'use strict';

  onl.decorate({
    showmoreless: function(element) {
      new showmoreless(element);
    }
  });

  var showmoreless = function(element) {
    this.element = element;
    this.listitems = [].slice.call(this.element.querySelectorAll('li'));
    this.config = JSON.parse(this.element.getAttribute('data-config')) || [];
    this.config.amountVisible = this.config.amount || '5';
    this.config.labelMore = this.config.labelmore || 'Toon meer';
    this.config.labelLess = this.config.labelless || 'Toon minder';
    this.allvisible = false;
    this.init();
  };

  showmoreless.prototype.init = function() {
    this.hideItems(true);
  };

  showmoreless.prototype.hideItems = function(createTrigger) {
    var i;
    var y = 0;

    for ( i = 0; i < this.listitems.length; i++ ) {
      if ( i > this.config.amountVisible - 1 ) {
        this.listitems[i].setAttribute('hidden', 'true');
        this.listitems[i].setAttribute('aria-hidden', 'true');
        y++;
      }
    }
    this.totalHidden = y;
    if ( createTrigger && i > this.config.amountVisible) {
      this.addTrigger();
    }
  };

  showmoreless.prototype.addTrigger = function() {
    this.trigger = document.createElement('li');
    this.trigger.classList.add('link');
    this.trigger.classList.add('link--down');

    this.triggerA = document.createElement('a');
    this.triggerA.setAttribute('href', '#');
    this.triggerA.setAttribute('tabindex', '0');
    this.triggerA.setAttribute('aria-expanded', false);
    this.triggerA.innerHTML = 'Toon meer' + ' (' + this.totalHidden + ')';

    this.trigger.appendChild(this.triggerA);


    this.element.querySelector('ul').appendChild(this.trigger);

    this.triggerA.addEventListener('click', function(e) { e.preventDefault(); this.showHide(e); }.bind(this), false);
  };

  showmoreless.prototype.showHide = function() {
    var i;
    if ( this.allvisible ) {
      this.hideItems();
      this.allvisible = false;
      this.trigger.classList.remove('link--up');
      this.trigger.classList.add('link--down');
      this.triggerA.innerHTML = this.config.labelMore + ' (' + this.totalHidden + ')';
      this.triggerA.setAttribute('aria-expanded', false);
    } else {
      for (i = 0; i < this.listitems.length; i++) {
        this.listitems[i].removeAttribute('hidden', 'true');
        this.listitems[i].removeAttribute('aria-hidden', 'true');
      }
      this.allvisible = true;
      this.trigger.classList.add('link--up');
      this.trigger.classList.remove('link--down');
      this.triggerA.innerHTML = this.config.labelLess;
      this.triggerA.setAttribute('aria-expanded', true);
    }
  };

  showmoreless.prototype.removeTrigger = function() {
    this.trigger.parentNode.removeChild(this.trigger);
  };

})();
