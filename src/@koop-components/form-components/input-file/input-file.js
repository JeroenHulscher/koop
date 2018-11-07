(function () {

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

    if (onl.ui.hasDragDrop()) {
      this.element.classList.add('has-dragdrop');
    }

    function addListenerMulti(element, eventNames, listener) {
      var events = eventNames.split(' ');
      for (var i = 0, iLen = events.length; i < iLen; i++) {
        element.addEventListener(events[i], listener, false);
      }
    }

    addListenerMulti( this.element, 'drag dragstart dragend dragover dragenter dragleave drop', function ( e ) {
      e.preventDefault();
      e.stopPropagation();
    });

    addListenerMulti( this.element, 'dragover dragenter', function () {
      self.element.classList.add( 'is-dragover' );
    });

    addListenerMulti( this.element, 'dragleave dragend drop', function () {
      self.element.classList.remove('is-dragover');
    });

    this.element.addEventListener( 'drop', function( e ) {
      self.setAttributes(e.dataTransfer.files);
    });

    this.element.addEventListener( 'change', function( e ) {
      self.setAttributes(e.target.files);
    });

    this.eventListers();

  };

  inputfile.prototype.setAttributes = function(e) {
    var fileName = '';

    if (e[0] && e.length > 1) {
      fileName = (this.getAttribute('data-multiple-caption') || '').replace('{count}', this.files.length);
    }
    else if (e[0] && e.length === 1) {
      fileName = e[0].name;
    } else {
      fileName = false;
    }

    if (fileName) {
      this.label.querySelector('span').innerHTML = 'Selecteer ander document';
      this.prelabel.innerHTML = fileName;
      this.element.classList.add('has-file');
      if (this.config.showbuttonAfterChange) {
        this.showbuttonAfterChange();
      }
    }
    else {
      this.label.innerHTML = this.orginalLabelValue;
      this.prelabel.innerHTML = this.orginalPreLabelValue;
      this.element.classList.remove('has-file');
      if (this.config.showbuttonAfterChange) {
        this.hidebuttonAfterChange();
      }
    }
  };

  inputfile.prototype.showbuttonAfterChange = function() {
    document.querySelector( this.showbuttonClass ).removeAttribute('hidden');
  };
  inputfile.prototype.hidebuttonAfterChange = function() {
    document.querySelector( this.showbuttonClass ).addAttribute('hidden');
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
