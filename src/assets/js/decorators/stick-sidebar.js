( function() {

  'use strict';

  var referenceTop;
  var h1ReferenceTop;
  var element;
  var footer;
  var resizeTimeout;
  var left;
  var detailsInSidebar = false;
  var getScrollY = function() {
    return window.pageYOffset || document.documentElement.scrollTop;
  };

  var toggle = function( button ) {
    var labelOpen = button.getAttribute( 'data-toggle-open' ) || 'Open';
    var labelClose = button.getAttribute( 'data-toggle-close' ) || 'Sluit';
    var isOpen = button.getAttribute( 'aria-expanded' ) === 'true';

    if ( isOpen ) {
      button.textContent = labelOpen;
      button.setAttribute( 'aria-expanded', 'false' );
      document.body.classList.remove( 'has-stickysidebar-open' );
      onl.ui.unbindFocusTrap( button.parentNode );
    }
    else {
      button.textContent = labelClose;
      button.setAttribute( 'aria-expanded', 'true' );
      document.body.classList.add( 'has-stickysidebar-open' );
      onl.ui.bindFocusTrap( button.parentNode );
    }
  };

  var updateStickability = function() {
    var footerOffset = footer.getBoundingClientRect();
    var scrollY = getScrollY();
    var howMuchOfFooterIsVisible = Math.max( ( window.innerHeight - footerOffset.top ), 0 );
    var sidebarHeight = ( window.innerHeight - howMuchOfFooterIsVisible - 32 );
    var onDesktop = window.matchMedia && window.matchMedia( '(min-width: 50em)' ).matches;

    if ( scrollY > referenceTop && onDesktop ) {
      element.classList.add('is-sticky');
      element.style.position = 'fixed';
      element.style.top = '1em';
      element.style.left = left + 'px';
      element.style.height = sidebarHeight + 'px';
    }
    else {
      element.removeAttribute( 'style' );
      element.classList.remove('is-sticky');
    }

    if (onl.dom.$('.holder')[0]){
      if ((scrollY > h1ReferenceTop && onDesktop)) {
        detailsInSidebar = true;
        var h1Text = onl.dom.$('h1')[0].innerHTML;
        onl.dom.$('.holder')[0].innerHTML = h1Text;
      } else {
        onl.dom.$('.holder')[0].innerHTML = '';
        detailsInSidebar = false;
      }
    }
  };

  onl.decorate({
    'add-mobile-foldability': function( el ) {
      var button = document.createElement( 'button' );
      var labels = {
        open: 'Open sidebar',
        close: 'Sluit sidebar'
      };

      // set data to button
      // button.classList.add( 'hidden-desktop' );
      button.type = 'button';
      button.setAttribute( 'data-handler', 'toggle-sidebar' );
      button.setAttribute( 'aria-controls', el.id );
      button.setAttribute( 'data-toggle-open', labels.open );
      button.setAttribute( 'data-toggle-close', labels.close );


      // set initial state
      button.setAttribute( 'aria-expanded', 'false' );
      button.textContent = labels.close;

      el.before( button );

      // apply first time
      // if ( !( window.matchMedia( '(min-width: 50em)' ).matches ) ) {
      //   toggle( button );
      // }
    },
    'stick-sidebar': function( el ) {
      var timer;

      footer = onl.dom.$( '.footer' )[0];
      element = el;
      var calculate = function() {
        referenceTop = element.closest( '.columns--sticky-sidebar' ).getBoundingClientRect().top + getScrollY() + 16;
        left = onl.dom.$( '.breadcrumb' )[0].getBoundingClientRect().left;
        h1ReferenceTop = onl.dom.$('h1')[0].getBoundingClientRect().bottom;
      };

      calculate();

      // window.requestAnimationFrame(updateStickability);
      // updateStickability();

      window.addEventListener( 'othersites:open', function() {
        window.setTimeout( function() {
          calculate();
        }, 500 );
      });

      window.addEventListener( 'othersites:close', function() {
        calculate();
      });

      window.addEventListener( 'scroll', function() {
        if (timer) {
          window.clearTimeout(timer);
        }

        timer = window.setTimeout(function () {
          // window.requestAnimationFrame(updateStickability);
          updateStickability();
        }, 10);
      });

      window.addEventListener( 'resize', function() {
        if (resizeTimeout) {
          clearTimeout(resizeTimeout);
        }
        resizeTimeout = window.setTimeout( function() {
          calculate();
        }, 50);
      });
    }

  });

  onl.handle({
    'toggle-sidebar': function( el ) {
      toggle( el );
    }
  });
})();
