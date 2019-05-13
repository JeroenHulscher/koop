(function () {

  'use strict';

  var previouslyFocused = null;


  var modalsidebar = {
    open: function( modal ) {
      previouslyFocused = document.activeElement;

      modal.classList.add('is-open');

      onl.ui.focus( modal );
      onl.ui.bindFocusTrap( modal );
    },
    close: function( modal ) {

      modal.classList.remove('is-open');

      onl.ui.unbindFocusTrap( modal );

      if ( previouslyFocused ) {
        onl.ui.focus( previouslyFocused );
      }
    }
  };

  onl.decorate({
    'init-modalsidebar': function() {
    },
    'init-fixedbottom-button': function(element) {
      new fixedbottomButton(element);
    }
  });

  var fixedbottomButton = function (element) {
    this.element = element;
    this.config = JSON.parse(this.element.getAttribute('data-config')) || [];
    this.allInputs = onl.dom.$( 'input, select', element );
    this.button = onl.dom.$( '.js-fixedbottom-button__button', element )[0];
    this.init();
  };

  fixedbottomButton.prototype.init = function () {
    this.attachListerners();
  };
  fixedbottomButton.prototype.attachListerners = function () {
    var i;

    for (i = 0; i < this.allInputs.length; i++) {
      //this.buttonClose[i].addEventListener('click', function (e) { this.parseSelectedOptions(e); }.bind(this), false);
      this.allInputs[i].addEventListener('change', function (e) { this.doChangeAction(e); }.bind(this), false);
    }
  };
  fixedbottomButton.prototype.doChangeAction = function () {
    this.button.removeAttribute('hidden');
  };

  onl.handle({
    'open-modalsidebar': function( element ) {
      var modalElement = document.getElementById( element.getAttribute( 'data-modal' ) );
      var body = document.getElementsByTagName('body');

      body[0].classList.add('no-scroll');
      body[0].classList.add('has-modal-open');

      modalsidebar.open( modalElement );
    },
    'close-modalsidebar': function( element ) {
      var modalElement;
      var body = document.getElementsByTagName('body');

      body[0].classList.remove('no-scroll');
      body[0].classList.remove('has-modal-open');

      if ( element.getAttribute( 'data-modal' ) ) {
        modalElement = document.getElementById( element.getAttribute( 'data-modal' ) );
      }
      else {
        modalElement = element.closest( '.modal-sidebar' );
      }

      modalsidebar.close( modalElement );
    }
  });
})();
