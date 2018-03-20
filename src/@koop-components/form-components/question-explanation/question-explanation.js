ohnl.handle({
  'toggle-explanation': function(element, event) {
    var explanation = ohnl.dom.getElementFromHref( element.href );

    event.preventDefault();

    if ( !explanation.hasAttribute( 'data-explanation-opener' ) ) {
      explanation.setAttribute( 'data-explanation-opener', element.id );
    }
    if ( ohnl.ui.isHidden( explanation ) ) {
      ohnl.ui.show( explanation, explanation );
    }
    else {
      ohnl.ui.hide( explanation );
    }
  },
  'close-explanation': function(element, event) {
    var explanation = element.closest( '.question-explanation' );
    var explanationOpener = document.getElementById( explanation.getAttribute( 'data-explanation-opener' ) );

    if ( explanationOpener ) {
      ohnl.ui.hide( explanation, explanationOpener );
    }
    event.preventDefault();
  }
});