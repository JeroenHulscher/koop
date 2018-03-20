(function () {

  'use strict';

  var getScrollY = function() {
    var supportPageOffset = window.pageXOffset !== undefined;
    var isCSS1Compat = ( ( document.compatMode || '' ) === 'CSS1Compat' );

    return supportPageOffset ? window.pageYOffset : isCSS1Compat ? document.documentElement.scrollTop : document.body.scrollTop;
  };

  var toggle = function(element) {
    var button = element;
    var labelOpen = button.getAttribute( 'data-toggle-open' ) || 'Open';
    var labelClose = button.getAttribute( 'data-toggle-close' ) || 'Sluit';
    var toggles = document.getElementById( button.getAttribute( 'aria-controls' ) );
    var isOpen = button.getAttribute( 'aria-expanded' ) === 'true';

    if ( isOpen ) {
      button.textContent = labelOpen;
      button.setAttribute( 'aria-expanded', 'false' );
      ohnl.ui.hide( toggles );
      document.body.classList.remove( 'no-scroll' );
      ohnl.ui.unbindFocusTrap( button.parentNode );
    }
    else {
      button.textContent = labelClose;
      button.setAttribute( 'aria-expanded', 'true' );
      ohnl.ui.show( toggles );
      document.body.classList.add( 'no-scroll' );
      ohnl.ui.bindFocusTrap( button.parentNode );
    }
  }

  var updateStickability = function( element, footer ) {
    var footerOffset = footer.getBoundingClientRect();
    var elementPosition = element.getBoundingClientRect();
    var elementReferenceTop = element.referenceTop;
    var scrollY = getScrollY();
    var howMuchOfFooterIsVisible = Math.max( ( window.innerHeight - footerOffset.top ), 0 );
    var sidebarHeight = ( window.innerHeight - howMuchOfFooterIsVisible - 32 );
    var onDesktop = window.matchMedia && window.matchMedia( '(min-width: 50em)' ).matches;

    elementPosition.left -= element.offsetLeft - 16;

    if ( scrollY > elementReferenceTop && onDesktop ) {
      element.style.position = 'fixed';
      element.style.top = '1em';
      element.style.left = elementPosition.left + 'px';
      element.style.height = sidebarHeight + 'px';
    }
    else {
      element.removeAttribute( 'style' );
    }

    window.requestAnimationFrame( function() {
      updateStickability( element, footer );
    });
  };

  ohnl.decorate({
    'add-mobile-foldability': function( element ) {
      var button = document.createElement( 'button' );
      var labels = {
        open: 'Open sidebar',
        close: 'Sluit sidebar'
      };

      // set data to button
      button.classList.add( 'hidden-desktop' );
      button.type = 'button';
      button.setAttribute( 'data-handler', 'toggle-sidebar' );
      button.setAttribute( 'aria-controls', element.id );
      button.setAttribute( 'data-toggle-open', labels.open );
      button.setAttribute( 'data-toggle-close', labels.close );

      // set initial state
      button.setAttribute( 'aria-expanded', 'true' );
      button.textContent = labels.close;

      element.before( button );

      // apply first time
      if ( !( window.matchMedia( '(min-width: 50em)' ).matches ) ) {
        toggle( button );
      }
    },
    'stick-sidebar': function( element ) {
      var footer = ohnl.dom.$( '.footer' )[0];
      var referenceTop = element.closest( '.columns--sticky-sidebar' ).getBoundingClientRect().top + 16;

      element.referenceTop = referenceTop;

      window.requestAnimationFrame( function() {
        updateStickability( element, footer );
      });

      window.addEventListener( 'othersites:open', function() {
        window.setTimeout( function() {
          element.referenceTop = element.getBoundingClientRect().top + getScrollY();
        }, 500 );
      });

      window.addEventListener( 'othersites:close', function() {
        element.referenceTop = element.getBoundingClientRect().top + getScrollY();
      });
    }

  });

  ohnl.handle({
    'toggle-sidebar': function( element ) {
      toggle(element);
    }
  });

})();