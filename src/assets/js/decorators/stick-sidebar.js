( function() {

  'use strict';

  var referenceTop;
  var element;
  var footer;

  var getScrollY = function() {
    return window.pageYOffset || document.documentElement.scrollTop;
  };

  var toggle = function( button ) {
    var labelOpen = button.getAttribute( 'data-toggle-open' ) || 'Open';
    var labelClose = button.getAttribute( 'data-toggle-close' ) || 'Sluit';
    var toggles = document.getElementById( button.getAttribute( 'aria-controls' ) );
    var isOpen = button.getAttribute( 'aria-expanded' ) === 'true';

    if ( isOpen ) {
      button.textContent = labelOpen;
      button.setAttribute( 'aria-expanded', 'false' );
      onl.ui.hide( toggles );
      document.body.classList.remove( 'no-scroll' );
      onl.ui.unbindFocusTrap( button.parentNode );
    }
    else {
      button.textContent = labelClose;
      button.setAttribute( 'aria-expanded', 'true' );
      onl.ui.show( toggles );
      document.body.classList.add( 'no-scroll' );
      onl.ui.bindFocusTrap( button.parentNode );
    }
  };

  var updateStickability = function() {
    var footerOffset = footer.getBoundingClientRect();
    var elementPosition = element.getBoundingClientRect();
    var scrollY = getScrollY();
    var howMuchOfFooterIsVisible = Math.max( ( window.innerHeight - footerOffset.top ), 0 );
    var sidebarHeight = ( window.innerHeight - howMuchOfFooterIsVisible - 32 );
    var onDesktop = window.matchMedia && window.matchMedia( '(min-width: 50em)' ).matches;

    if ( scrollY > referenceTop && onDesktop ) {
      element.style.position = 'fixed';
      element.style.top = '1em';
      element.style.left = elementPosition.left + 'px';
      element.style.height = sidebarHeight + 'px';
    }
    else {
      element.removeAttribute( 'style' );
    }

    window.requestAnimationFrame(updateStickability);
  };

  onl.decorate({
    'add-mobile-foldability': function( el ) {
      var button = document.createElement( 'button' );
      var labels = {
        open: 'Open sidebar',
        close: 'Sluit sidebar'
      };

      // set data to button
      button.classList.add( 'hidden-desktop' );
      button.type = 'button';
      button.setAttribute( 'data-handler', 'toggle-sidebar' );
      button.setAttribute( 'aria-controls', el.id );
      button.setAttribute( 'data-toggle-open', labels.open );
      button.setAttribute( 'data-toggle-close', labels.close );

      // set initial state
      button.setAttribute( 'aria-expanded', 'true' );
      button.textContent = labels.close;

      el.before( button );

      // apply first time
      if ( !( window.matchMedia( '(min-width: 50em)' ).matches ) ) {
        toggle( button );
      }
    },
    'stick-sidebar': function( el ) {
      footer = onl.dom.$( '.footer' )[0];
      element = el;
      referenceTop = el.closest( '.columns--sticky-sidebar' ).getBoundingClientRect().top + 16;

      window.requestAnimationFrame(updateStickability);

      window.addEventListener( 'othersites:open', function() {
        window.setTimeout( function() {
          referenceTop = element.closest( '.columns--sticky-sidebar' ).getBoundingClientRect().top + getScrollY() + 16;
        }, 500 );
      });

      window.addEventListener( 'othersites:close', function() {
        referenceTop = element.closest( '.columns--sticky-sidebar' ).getBoundingClientRect().top + 16;
      });
    }

  });

  onl.handle({
    'toggle-sidebar': function( el ) {
      toggle( el );
    }
  });

})();
