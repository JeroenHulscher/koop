onl.handle({
  'toggle-explanation': function(element, event) {
    var explanation = onl.dom.getElementFromHref( element.href );

    event.preventDefault();

    if ( !explanation.hasAttribute( 'data-explanation-opener' ) ) {
      explanation.setAttribute( 'data-explanation-opener', element.id );
    }
    if ( onl.ui.isHidden( explanation ) ) {
      onl.ui.show( explanation, explanation );
    }
    else {
      onl.ui.hide( explanation );
    }
  },
  'close-explanation': function(element, event) {
    var explanation = element.closest( '.question-explanation' );
    var explanationOpener = document.getElementById( explanation.getAttribute( 'data-explanation-opener' ) );

    if ( explanationOpener ) {
      onl.ui.hide( explanation, explanationOpener );
    }
    event.preventDefault();
  }
});