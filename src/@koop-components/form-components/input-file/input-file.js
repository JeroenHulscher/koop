(function () {

  onl.decorate({
    'init-inputfile': function( element ) {
      new inputfile( element );
    }
  });

  var inputfile = function( element ) {
    this.element = element;
    this.area = this.element.querySelector( '.js-input-dragbox' );
    this.label = this.element.querySelector( 'label' );
    this.prelabel = this.element.querySelector( '.js-input-dragbox__prelabel' );
    this.orginalLabelValue = this.label.innerHTML;
    this.orginalPreLabelValue = this.prelabel.innerHTML;
    this.input = this.element.querySelector( 'input[type="file"]' );
    this.buttonReset = this.element.querySelector( '.js-reset' );
    this.submitbuttonClass = '.js-input-dragbox__button';
    this.config = JSON.parse( this.element.getAttribute( 'data-config' ) ) || [];
    this.droppedFiles = false;
    this.debug = this.config.debug;
    this.responseMsg = this.element.querySelector( '.js-input-dragbox__msg' );
    this.init();
  };
  inputfile.prototype.init = function( ) {
    var self = this;

    if (onl.ui.hasDragDrop()) {
      this.area.classList.add('has-dragdrop');
    }

    function addListenerMulti(element, eventNames, listener) {
      var events = eventNames.split(' ');
      for (var i = 0, iLen = events.length; i < iLen; i++) {
        element.addEventListener(events[i], listener, false);
      }
    }

    addListenerMulti( this.area, 'drag dragstart dragend dragover dragenter dragleave drop', function ( e ) {
      e.preventDefault();
      e.stopPropagation();
    });

    addListenerMulti( this.area, 'dragover dragenter', function () {
      self.area.classList.add( 'is-dragover' );
    });

    addListenerMulti( this.area, 'dragleave dragend drop', function () {
      self.area.classList.remove('is-dragover');
    });

    this.area.addEventListener( 'drop', function( e ) {
      self.droppedFiles = e.dataTransfer.files;
      self.setAttributes(e.dataTransfer.files);
    });

    this.area.addEventListener( 'change', function( e ) {
      self.droppedFiles = e.target.files;
      self.setAttributes(e.target.files);
    });

    this.eventListers();

    // if ( this.config.ajax !== 'undefined' ) {
      // console.log('this.submitbuttonClass', this.submitbuttonClass);
      // this.submitbuttonClass.addEventListener('submit', function (e) { e.preventDefault(); e.stopPropagation(); this.submitHandler(e) }.bind(this), false);
    // }

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
      this.area.classList.add('has-file');
      if (this.config.showbuttonAfterChange) {
        this.showbuttonAfterChange();
      }
    }
    else {
      this.label.innerHTML = this.orginalLabelValue;
      this.prelabel.innerHTML = this.orginalPreLabelValue;
      this.area.classList.remove('has-file');
      if (this.config.showbuttonAfterChange) {
        this.hidebuttonAfterChange();
      }
    }
  };

  inputfile.prototype.showbuttonAfterChange = function() {
    this.element.querySelector( this.submitbuttonClass ).removeAttribute('hidden');
  };
  inputfile.prototype.hidebuttonAfterChange = function() {
    this.element.querySelector( this.submitbuttonClass ).addAttribute('hidden');
  };

  inputfile.prototype.resetElement = function() {
    this.element.querySelector('.js-input-dragbox').classList.remove('is-success');
    this.element.querySelector('.js-input-dragbox').classList.remove('is-uploading');
  };

  inputfile.prototype.eventListers = function() {
    this.label.addEventListener( 'keyup', function( event ) {
      event.preventDefault();
      if ( event.keyCode === 13 ) {
        this.click();
      }
    });

    this.buttonReset.addEventListener('click', function ( e ) { this.resetElement(e) }.bind( this ), false );


    // Firefox bug fix
    this.area.addEventListener('focus', function ( e ) { this.area.classList.add('has-focus'); }.bind( this ), false );
    this.area.addEventListener('blur', function ( e ) { this.area.classList.remove('has-focus'); }.bind( this ), false );

    this.element.addEventListener('submit', function (e) {
      console.log('submit');
      this.ajax = new XMLHttpRequest();
      var errorMsg;
      var ajaxData = new FormData( this.element );

      if (this.area.classList.contains('is-uploading')) return false;

      this.area.classList.add('is-uploading');
      this.area.classList.remove('is-error');

      if ( onl.ui.hasDragDrop() ) {
        e.preventDefault();

        // gathering the form data
        if( this.droppedFiles ) {
          Array.prototype.forEach.call( this.droppedFiles, function( file ) {
            ajaxData.append( this.input.getAttribute( 'name' ), file );
          }.bind(this));
        }

        if (!this.debug) {
          this.ajax.upload.addEventListener( 'progress', function (e) { this.progressHandler(e); }.bind(this), false );
          this.ajax.upload.addEventListener( 'load', function (e) { this.loadHandler(e); }.bind(this), false );
          this.ajax.upload.addEventListener( 'error', function (e) { this.errorHandler(e); }.bind(this), false );
          this.ajax.open( this.element.getAttribute( 'method' ), this.element.getAttribute( 'action' ), true );
          this.ajax.send( ajaxData );
        } else {
          this.ajax = new Array({
            status: 300,
            responseText: {
              success: true,
              message: 'Bestand is succesvol geupload'
            }
          });
          this.ajax = this.ajax[0];
          // this.ajax.status = 300;
          // this.ajax.responseText.success = true;
          this.loadHandler();
        }

      }

    }.bind(this), false);

  };

  inputfile.prototype.loadHandler = function (e) {
    this.area.classList.remove( 'is-uploading' );
    if (this.ajax.status >= 200 && this.ajax.status < 400 )
    {
      if ( this.debug && this.ajax.responseText.success ) {
        this.area.classList.add( this.ajax.responseText.success == true ? 'is-success' : 'is-error' );
        this.responseMsg.innerHTML = this.ajax.message;
      } else {
        var data = JSON.parse( this.ajax.responseText );
        this.area.classList.add( data.success == true ? 'is-success' : 'is-error' );
        this.responseMsg.innerHTML = this.ajax.message;
      }

    }

  };

  inputfile.prototype.errorHandler = function (e) {
    this.element.classList.remove( 'is-uploading' );
    this.responseMsg.innerHTML = 'Document kan niet worden geupload';
  };

  inputfile.prototype.progressHandler = function(event) {
    var percent = (event.loaded / event.total) * 100;

    this.element.querySelector('.input-dragbox__uploading__msg span').innerHTML = Math.round(percent);
    this.element.querySelector('.input-dragbox__uploading__progress').value = Math.round(percent);
  };

})();
