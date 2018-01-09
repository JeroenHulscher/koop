module.exports = function toggleNav( element ) {
  var ui = require( 'helpers/ui' );
  var nav = document.getElementById( element.getAttribute( 'aria-controls' ) );
  var closedClass = 'header__nav--closed';

  if ( element.getAttribute( 'aria-expanded' ) === 'false' ) {
    nav.classList.remove( closedClass );
    element.setAttribute( 'aria-expanded', 'true' );
    ui.focus( nav );
  }
  else {
    nav.classList.add( closedClass );
    element.setAttribute( 'aria-expanded', 'false' );
  }
}
