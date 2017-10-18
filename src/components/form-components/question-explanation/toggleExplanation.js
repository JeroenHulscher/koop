var ui = require( 'helpers/ui' );
var dom = require( 'helpers/dom' );

var toggleExplanation = function( element, event ) {
  var explanation = dom.getElementFromHref( element.href );

  event.preventDefault();

  if ( !explanation.hasAttribute( 'data-explanation-opener' ) ) {
    explanation.setAttribute( 'data-explanation-opener', element.id );
  }
  if ( ui.isHidden( explanation ) ) {
    ui.show( explanation, explanation );
  }
  else {
    ui.hide( explanation );
  }
}

module.exports = toggleExplanation;
