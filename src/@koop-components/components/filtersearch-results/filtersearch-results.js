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

    this.addEventListeners();
  };

  filterResults.prototype.addEventListeners = function() {
    this.input.addEventListener('keyup', function() { this.doFilter(); }.bind(this), false);
  };
  filterResults.prototype.doFilter = function() {
    var i;
    var a;
    var txtValue;
    var filter = this.input.value.toUpperCase();

    for (i = 0; i < this.results.length; i++) {
      a = this.results[i];
      txtValue = a.textContent || a.innerText;

      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        this.results[i].style.display = '';
      } else {
        this.results[i].style.display = 'none';
      }
    }
  };


})();
