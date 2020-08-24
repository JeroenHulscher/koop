(function () {

  'use strict';

  onl.decorate({

    'init-filter-results': function (element) {
      new filterResults(element);
    }

  });

  var filterResults = function( element ) {
    this.element = element;
    this.config = JSON.parse( this.element.getAttribute( 'data-config' ) ) || [];
    this.init();
  };

  filterResults.prototype.init = function() {
    this.input = onl.dom.$( '.js-filterresults__input', this.element )[0];
    this.results = onl.dom.$( '.js-filterresults__result', this.element );
    this.setContainerClass = '.js-filterresults__resultmother';

    this.containers = this.element.querySelectorAll(this.setContainerClass);

    this.addEventListeners();
  };

  filterResults.prototype.addEventListeners = function() {
    this.input.addEventListener('keyup', function() { this.doFilter(); }.bind(this), false);
  };
  filterResults.prototype.doFilter = function() {
    var i;
    var y;
    var a;
    var txtValue;
    var filter = this.input.value.toUpperCase();

    for (i = 0; i < this.results.length; i++) {
      a = this.results[i];
      txtValue = a.textContent || a.innerText;

      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        this.results[i].removeAttribute('aria-hidden');
        this.results[i].classList.add('is-visible');
        this.results[i].classList.remove('is-invisible');
      } else {
        this.results[i].setAttribute('aria-hidden', 'true');
        this.results[i].classList.add('is-invisible');
        this.results[i].classList.remove('is-visible');
      }
    }

    // If an set has no visible options inside, hide the set-container;
    for (y = 0; y < this.containers.length; y++) {
      var results = this.containers[y].querySelectorAll('.is-visible');
      if(results.length < 1) {
        this.containers[y].setAttribute('aria-hidden', 'true');
      } else {
        this.containers[y].removeAttribute('aria-hidden');
      }
    }
  };


})();
