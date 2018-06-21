(function () {

  'use strict';

  onl.decorate({

    'init-form-subselection': function (element) {
      new formSubselection(element);
    }

  });

  var formSubselection = function( element ) {
    this.element = element;
    this.init();
  };

  formSubselection.prototype.init = function() {
    this.containerSummary = onl.dom.$( '.subselection__summary', this.element )[0];
    this.buttonClose = onl.dom.$( '[data-handler="close-modal"]', this.element );
    this.options = onl.dom.$( 'input[type=checkbox]', this.element );
    this.items = [];

    this.attachListeners();
  };

  formSubselection.prototype.attachListeners = function() {
    var i;
    var y;

    for ( i = 0; i < this.buttonClose.length; i++ ) {
      this.buttonClose[i].addEventListener( 'click', function (e) { this.parseSelectedOptions(e); }.bind(this), false);
    }

    for ( y = 0; y < this.options.length; y++ ) {
      this.options[y].addEventListener( 'change', function (e) { this.collectValues(e); }.bind(this), false);
    }
  };

  formSubselection.prototype.collectValues = function() {
    var y;
    var option;

    // reset items;
    this.items = [];

    // loop through all checkbox's and add to array;
    for ( y = 0; y < this.options.length; y++ ) {
      option = [];
      if ( this.options[y].checked ) {
        option.push( this.options[y].value, this.options[y].closest( 'label' ).innerText );
        this.items.push( option );
      }
    }
  };

  formSubselection.prototype.parseSelectedOptions = function() {
    var y;
    var summary = '';

    for ( y = 0; y < this.items.length; y++ ) {
      summary += '<abbr title="' + this.items[y][1] + '">' + this.items[y][0] + '</abbr> ';
    }
    this.containerSummary.innerHTML = summary;
  };

})();
