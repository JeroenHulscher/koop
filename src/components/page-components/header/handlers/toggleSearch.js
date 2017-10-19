module.exports = function toggleSearch( element ) {
  var ui = require( 'helpers/ui' );
  var openText = 'Toon zoekfunctie';
  var closeText = 'Verberg zoekfunctie';
  var search = document.getElementById( element.getAttribute( 'aria-controls' ) );

  if ( ui.isHidden( search ) ) {
    ui.show( search );
    element.textContent = closeText;
    element.setAttribute( 'aria-expanded', 'true' );
  }
  else {
    ui.hide( search );
    element.textContent = openText;
    element.setAttribute( 'aria-expanded', 'false' );
  }
};
