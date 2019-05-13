(function () {

  'use strict';

  var modalInvisibleClass = 'modal--off-screen'; /* we use this so that we can animate visibility */
  var previouslyFocused = null;
  var SHOW_DELAY = 400;

  var modal = {
    open: function (modal, element ) {

      previouslyFocused = document.activeElement;

      // To facilitate animation, this show(), while it toggles the `hidden` attribute,
      // does not actually make it visible just yet
      onl.ui.show( modal );
      modal.classList.add('is-open');

      window.setTimeout( function() {
        // This makes the element actually visible on screen
        modal.classList.remove( modalInvisibleClass );
      }, SHOW_DELAY );

      onl.ui.focus( modal );
      onl.ui.bindFocusTrap( modal );

      var config = JSON.parse(element.getAttribute('data-config')) || [];
      if (typeof window[config.function] === 'function') {
        var functionToCall = window[config.function];
        new functionToCall(config.action, JSON.parse(document.getElementById(config.data).innerHTML));
      }

      // if ( config.function === 'kpm' ) {
      //   if ( config.action === 'push' ) {
      //     kpmService.push( JSON.parse(document.getElementById(config.data).innerHTML ) );
      //   }
      // }

    },
    close: function( modal ) {
      onl.ui.hide( modal );
      modal.classList.add( modalInvisibleClass );
      modal.classList.remove('is-open');

      onl.ui.unbindFocusTrap( modal );

      if ( previouslyFocused ) {
        onl.ui.focus( previouslyFocused );
      }
    },
    recalculateAndSetBounds: function( modalElement ) {
      var modal = modalElement;
      var height = window.innerHeight;
      var dialogContent = modal.querySelector( '.modal__content' );

      // reset height, before calculating
      dialogContent.style.height = 'auto';

      if ( ( dialogContent.offsetHeight + 100 ) >= height ) {
        dialogContent.style.height = height - 100 + 'px';
      } else {
        dialogContent.style.height = 'auto';
      }
    },
    setHeight: function( modalElement ) {
      var resizeTimeout;

      modal.recalculateAndSetBounds( modalElement );

      window.addEventListener( 'resize', function() {
        if ( resizeTimeout ) {
          clearTimeout( resizeTimeout );
        }
        resizeTimeout = window.setTimeout( function() {
          modal.recalculateAndSetBounds( modalElement );
        }, 50 );
      });
    }
  };

  onl.decorate({
    'init-modal': function( element ) {

    }
  });

  onl.handle({
    'open-modal': function( element, event ) {
      event.preventDefault();
      var modalElement = document.getElementById( element.getAttribute( 'data-modal' ) );
      var body = document.getElementsByTagName('body');
      body[0].classList.add('no-scroll');
      body[0].classList.add('is-modal-open');

      modal.open(modalElement, element );
      modal.setHeight ( modalElement );
    },
    'close-modal': function( element ) {
      var modalElement;
      var body = document.getElementsByTagName('body');
      body[0].classList.remove('no-scroll');
      body[0].classList.remove('is-modal-open');

      if ( element.getAttribute( 'data-modal' ) ) {
        modalElement = document.getElementById( element.getAttribute( 'data-modal' ) );
      }
      else {
        modalElement = element.closest( '.modal' );
      }

      modal.close( modalElement );
    }
  });


})();
