onl.handle({
  'toggle-explanation': function( element, event ) {
    var explanation = onl.dom.getElementFromHref( element.href );
    var tooltips = document.querySelectorAll( '.question-explanation__content .question-explanation__close' );
    var i;

    // close all open tooltips;
    for ( i = 0; i < tooltips.length; i++ ) {
      tooltips[i].click();
    }

    event.preventDefault();

    if ( !explanation.hasAttribute( 'data-explanation-opener' ) ) {
      explanation.setAttribute( 'data-explanation-opener', element.id );
    }
    if ( onl.ui.isHidden( explanation ) ) {
      var windowWidth = window.innerWidth;

      onl.ui.show( explanation, explanation );

      var targetRect = explanation.getBoundingClientRect();
      var targetWidth = targetRect.width || ( targetRect.left - targetRect.right );

      // IF tooltip position too big for placement on the right;
      if ( windowWidth <= targetRect.left + targetWidth ) {
        explanation.classList.add( 'question-explanation__content--left' );
        // recalculate its bounds;
        targetRect = explanation.getBoundingClientRect();
        if ( window.pageXOffset > targetRect.left ) {
          explanation.classList.remove( 'question-explanation__content--left' );
          explanation.classList.add( 'question-explanation__content--fixed' );
        }
      }

    }
    else {
      onl.ui.hide( explanation );
      explanation.classList.remove( 'question-explanation__content--left' );
      explanation.classList.remove( 'question-explanation__content--fixed' );
    }
  },
  'close-explanation': function( element, event ) {
    var explanation = element.closest( '.question-explanation__content' );
    var explanationOpener = document.getElementById( explanation.getAttribute( 'data-explanation-opener' ) );

    if ( explanationOpener ) {
      onl.ui.hide( explanation, explanationOpener );
      explanation.classList.remove( 'question-explanation__content--left' );
      explanation.classList.remove( 'question-explanation__content--fixed' );
    }
    event.preventDefault();
  }
});

onl.decorate({
  'hide-self': function( element ) {
    onl.ui.hide( element );
  }
});
