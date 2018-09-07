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
    this.prelabel = element.querySelector( '.js-input-dragbox__prelabel' );
    this.orginalLabelValue = this.label.innerHTML;
    this.orginalPreLabelValue = this.prelabel.innerHTML;
    this.input = element.querySelector( 'input' );
    this.showbuttonClass = '.js-input-dragbox__button';
    this.config = JSON.parse( this.element.getAttribute( 'data-config' ) ) || [];
    this.init();
  };

  inputfile.prototype.init = function( ) {
    var self = this;

    this.element.addEventListener( 'change', function( e ) {
      var fileName = '';

      if ( this.files && this.files.length > 1 ) {
        fileName = ( this.getAttribute( 'data-multiple-caption' ) || '' ).replace( '{count}', this.files.length );
      }
      else {
        fileName = e.target.value.split( '\\' ).pop();
      }

      if ( fileName ) {
        self.label.querySelector( 'span' ).innerHTML = 'Selecteer ander document';
        self.prelabel.innerHTML = fileName;
        self.element.classList.add( 'has-file' );
        if ( self.config.showbuttonAfterChange ) {
          self.showbuttonAfterChange();
        }
      }
      else {
        self.label.innerHTML = self.orginalLabelValue;
        self.prelabel.innerHTML = self.orginalPreLabelValue;
        self.element.classList.remove( 'has-file' );
        if ( self.config.showbuttonAfterChange ) {
          self.hidebuttonAfterChange();
        }
      }
    });

    this.eventListers();

  };

  inputfile.prototype.showbuttonAfterChange = function() {
    document.querySelector( this.showbuttonClass ).hidden = false;
  };
  inputfile.prototype.hidebuttonAfterChange = function() {
    document.querySelector( this.showbuttonClass ).hidden = true;
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

