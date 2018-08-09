(function () {

  'use strict';

  onl.decorate({
    'init-inputfile': function( element ) {
      new inputfile( element );
    }
  });

  var inputfile = function( element ) {
    this.element = element;
    this.label = element.querySelector( 'label' );
    this.input = element.querySelector( 'input' );
    this.init( element );
  };

  inputfile.prototype.init = function( element ) {
    var self = this;
    var labelVal = this.input.innerHTML;

    element.addEventListener( 'change', function( e ) {
      var fileName = '';

      if ( this.files && this.files.length > 1 ) {
        fileName = ( this.getAttribute( 'data-multiple-caption' ) || '' ).replace( '{count}', this.files.length );
      }
      else {
        fileName = e.target.value.split( '\\' ).pop();
      }

      if ( fileName ) {
        self.label.querySelector( 'span' ).innerHTML = fileName;
      }
      else {
        self.label.innerHTML = labelVal;
      }
    });

    this.eventListers();

  };

  inputfile.prototype.eventListers = function() {
    this.label.addEventListener( 'keyup', function( event ) {
      event.preventDefault();
      if ( event.keyCode === 13 ) {
        this.click();
      }
    });

    // Firefox bug fix
    this.element.addEventListener('focus', function () { element.classList.add('has-focus'); });
    this.element.addEventListener('blur', function () { element.classList.remove('has-focus'); });
  };

})();

