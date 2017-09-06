module.exports = function initToggleOtherSites( element ) {
  var dom = require( 'helpers/dom' );
  var ui = require( 'helpers/ui' );
  var otherSites = dom.getElementFromHref( element.href );

  element.setAttribute( 'aria-controls', otherSites.id );
  element.setAttribute( 'aria-expanded', 'false' );

  otherSites.classList.add( 'header__more--closed' );

  ui.hide( otherSites );
};
