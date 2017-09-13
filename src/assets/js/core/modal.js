var ui = require( 'helpers/ui' );
var modalInvisibleClass = 'modal--off-screen'; /* we use this so that we can animate visibility */
var previouslyFocused = null;
var SHOW_DELAY = 400;

var modal = {
  open: function( modal ) {
    previouslyFocused = document.activeElement;

    // To facilitate animation, this show(), while it toggles the `hidden` attribute,
    // does not actually make it visible just yet
    ui.show( modal );

    window.setTimeout( function() {
      // This makes the element actually visible on screen
      modal.classList.remove( modalInvisibleClass );
    }, SHOW_DELAY );

    ui.focus( modal );
    ui.bindFocusTrap( modal );
  },
  close: function( modal ) {
    ui.hide( modal );
    modal.classList.add( modalInvisibleClass );

    ui.unbindFocusTrap( modal );

    if ( previouslyFocused ) {
      ui.focus( previouslyFocused );
    }
  }
};

module.exports = modal;
