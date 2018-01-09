var ui = require( 'helpers/ui' );

var closeExplanation = function( element, event ) {
  var explanation = element.closest( '.question-explanation' );
  var explanationOpener = document.getElementById( explanation.getAttribute( 'data-explanation-opener' ) );

  if ( explanationOpener ) {
    ui.hide( explanation, explanationOpener );
  }
  event.preventDefault();
}

module.exports = closeExplanation;
