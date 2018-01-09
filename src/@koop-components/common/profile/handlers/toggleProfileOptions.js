var ui = require( 'helpers/ui' );

module.exports = function toggleProfileOptions( toggler ) {
  var toggledElement = document.getElementById( toggler.getAttribute( 'aria-controls' ) );
  var isExpanded = toggler.getAttribute( 'aria-expanded' ) === 'true';

  if ( isExpanded ) {
    ui.hide( toggledElement );
    toggler.setAttribute( 'aria-expanded', 'false' );
  }
  else {
    ui.show( toggledElement );
    toggler.setAttribute( 'aria-expanded', 'true' );
  }
};
