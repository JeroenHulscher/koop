var ui = require( 'helpers/ui' );

module.exports = function toggle( element ) {
  var button = element;
  var labelOpen = button.getAttribute( 'data-toggle-open' ) || 'Open';
  var labelClose = button.getAttribute( 'data-toggle-close' ) || 'Sluit';
  var toggles = document.getElementById( button.getAttribute( 'aria-controls' ) );
  var isOpen = button.getAttribute( 'aria-expanded' ) === 'true';

  if ( isOpen ) {
    button.textContent = labelOpen;
    button.setAttribute( 'aria-expanded', 'false' );
    ui.hide( toggles );
    document.body.classList.remove( 'no-scroll' );
    ui.unbindFocusTrap( button.parentNode );
  }
  else {
    button.textContent = labelClose;
    button.setAttribute( 'aria-expanded', 'true' );
    ui.show( toggles );
    document.body.classList.add( 'no-scroll' );
    ui.bindFocusTrap( button.parentNode );
  }
};
