var ui = require( 'helpers/ui' );

module.exports = function toggle( element ) {
  var button = element;
  var labelOpen = button.getAttribute( 'data-toggle-open' );
  var labelClose = button.getAttribute( 'data-toggle-close' );
  var toggles = document.getElementById( button.getAttribute( 'aria-controls' ) );
  var isOpen = button.getAttribute( 'aria-expanded' ) === 'true';

  if ( isOpen ) {
    button.textContent = labelOpen;
    ui.hide( toggles );
  }
  else {
    button.textContent = labelClose;
    ui.show( toggles );
  }
};
