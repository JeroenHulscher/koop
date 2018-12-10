onl.handle({
  'toggle-explanation': function( element, event ) {
    var explanation = onl.dom.getElementFromHref( element.href );
    var tooltips = document.querySelectorAll( '.question-explanation__content' );
    var i;

    // close all open tooltips;
    for ( i = 0; i < tooltips.length; i++ ) {
      tooltips[i].setAttribute('aria-hidden', 'true');
      tooltips[i].classList.add('is-hidden');
    }

    event.preventDefault();

    if ( !explanation.hasAttribute( 'data-explanation-opener' ) ) {
      explanation.setAttribute( 'data-explanation-opener', element.id );
    }
    if ( onl.ui.isHidden( explanation ) ) {
      var windowWidth = window.innerWidth;

      onl.ui.show( explanation, explanation );

      element.setAttribute('aria-expanded', 'true');
      element.classList.add('is-active');
      explanation.classList.remove('is-hidden');
      console.log('-');

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
  'explanation': function( element ) {
    element.classList.add('is-hidden');
  }
});
