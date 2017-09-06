module.exports = function toggleOtherSites( element ) {
  var dom = require( 'helpers/dom' );
  var ui = require( 'helpers/ui' );
  var otherSites = dom.getElementFromHref( element.href );
  var toggleState = element.getAttribute( 'aria-expanded' );

  if ( toggleState === 'true' ) {
    ui.hide( otherSites );
    element.setAttribute( 'aria-expanded', 'false' );
  }

  else {
    ui.show( otherSites );
    element.setAttribute( 'aria-expanded', 'true' );
  }
};

