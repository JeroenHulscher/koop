(function () {

  'use strict';

  var modalInvisibleClass = 'modal--off-screen'; /* we use this so that we can animate visibility */
  var previouslyFocused = null;
  var SHOW_DELAY = 400;

  var modal = {
    open: function( modal ) {
      previouslyFocused = document.activeElement;

      // To facilitate animation, this show(), while it toggles the `hidden` attribute,
      // does not actually make it visible just yet
      onl.ui.show( modal );

      window.setTimeout( function() {
        // This makes the element actually visible on screen
        modal.classList.remove( modalInvisibleClass );
      }, SHOW_DELAY );

      onl.ui.focus( modal );
      onl.ui.bindFocusTrap( modal );
    },
    close: function( modal ) {
      onl.ui.hide( modal );
      modal.classList.add( modalInvisibleClass );

      onl.ui.unbindFocusTrap( modal );

      if ( previouslyFocused ) {
        onl.ui.focus( previouslyFocused );
      }
    }
  };

  onl.handle({
    'open-modal': function(element) {
      var modalElement = document.getElementById( element.getAttribute( 'data-modal' ) );
      modal.open( modalElement );
    },
    'close-modal': function(element) {
      var modalElement;

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
