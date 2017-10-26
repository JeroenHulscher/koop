module.exports = function toggleOtherSites( element, event ) {
  var dom = require( 'helpers/dom' );
  var ui = require( 'helpers/ui' );
  var otherSites = dom.getElementFromHref( element.href );
  var toggleState = element.getAttribute( 'aria-expanded' );

  event.preventDefault();

  if ( toggleState === 'true' ) {
    ui.hide( otherSites );
    element.setAttribute( 'aria-expanded', 'false' );
  }

  else {
    ui.show( otherSites );

    if ( ui.getFocusableElements( otherSites ).length > 0 ) {
      ui.focus( ui.getFocusableElements( otherSites )[0] );
    }
    else {
      ui.focus ( otherSites );
    }

    element.setAttribute( 'aria-expanded', 'true' );
  }
};

