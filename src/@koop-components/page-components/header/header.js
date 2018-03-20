ohnl.handle({
  'toggle-other-sites': function (element, event) {
    var otherSites = ohnl.dom.getElementFromHref( element.href );
    var toggleState = element.getAttribute( 'aria-expanded' );
    var openEvent = document.createEvent( 'Event' );
    var closeEvent = document.createEvent( 'Event' );

    event.preventDefault();

    openEvent.initEvent( 'othersites:open', true, true );
    closeEvent.initEvent( 'othersites:close', true, true );

    if ( toggleState === 'true' ) {
      ohnl.ui.hide( otherSites );
      element.setAttribute( 'aria-expanded', 'false' );
      window.dispatchEvent( closeEvent );
    }

    else {
      ohnl.ui.show( otherSites );

      if ( ohnl.ui.getFocusableElements( otherSites ).length > 0 ) {
        ohnl.ui.focus( ohnl.ui.getFocusableElements( otherSites )[0] );
      }
      else {
        ohnl.ui.focus ( otherSites );
      }

      element.setAttribute( 'aria-expanded', 'true' );
      window.dispatchEvent( openEvent );
    }
  },
  'toggle-nav': function(element) {
    var nav = document.getElementById( element.getAttribute( 'aria-controls' ) );
    var closedClass = 'header__nav--closed';

    if ( element.getAttribute( 'aria-expanded' ) === 'false' ) {
      nav.classList.remove( closedClass );
      element.setAttribute( 'aria-expanded', 'true' );
      ohnl.ui.focus( nav );
    }
    else {
      nav.classList.add( closedClass );
      element.setAttribute( 'aria-expanded', 'false' );
    }
  }
});

ohnl.decorate({
  'init-toggle-other-sites': function(element) {
    var otherSites = ohnl.dom.getElementFromHref( element.href );

    element.setAttribute( 'aria-controls', otherSites.id );
    element.setAttribute( 'aria-expanded', 'false' );

    otherSites.classList.add( 'header__more--closed' );

    ohnl.ui.hide( otherSites );
  }
});
