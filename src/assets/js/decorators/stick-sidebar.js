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

  var updateStickability = function (scrollContentElement) {
    var footerOffset;
    var maxTop
    var disclaimer = document.querySelector('.disclaimer');
    var footer = document.querySelector('.footer');

    // the height of the sidebar (when sticky) is based on the footer area of the page;
    if (disclaimer) {
      footerOffset = disclaimer.getBoundingClientRect();
    } else if(footer){
      footerOffset = footer.getBoundingClientRect();
    }

    if (footerOffset) {
      maxTop = footerOffset.top;
    } else {
      maxTop = '0';
    }

    var scrollY = getScrollY();
    var howMuchOfFooterIsVisible = Math.max( ( window.innerHeight - maxTop ), 0 );
    var sidebarHeight = ( window.innerHeight - howMuchOfFooterIsVisible - 32 );
    var onDesktop = window.matchMedia && window.matchMedia( '(min-width: 65em)' ).matches;
    var elements;
    var i;

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

    if (onl.dom.$('.scrollContentReceiver')[0]){
      elements = document.querySelector(scrollContentElement).childNodes;

      onl.dom.$('.scrollContentReceiver')[0].innerHTML = '';

      if ((scrollY > h1ReferenceTop && onDesktop)) {
        for (i = 0; i < elements.length; i++){
          var cln = elements[i].cloneNode(true);
          document.querySelector('.scrollContentReceiver').appendChild(cln);
        }
      } else {
        onl.dom.$('.scrollContentReceiver')[0].innerHTML = '';
      }
    }
  };

  onl.decorate({
    'add-mobile-foldability': function( el ) {

        var parent;
        var newTop = '150';
        var parentOffsets;
        var documentbanner = document.querySelector('.documentbanner');
        if (documentbanner) {
          parent = documentbanner;
        } else {
          parent = el;
        }
        parentOffsets = parent.getBoundingClientRect();
        if(parentOffsets.top != '0') {
          newTop = parentOffsets.top;
        }
        var button = document.createElement( 'button' );
        var classlist = 'is-column-default';
        var labels = {
          open: 'Open sidebar',
          close: 'Sluit sidebar'
        };

        if (document.querySelector('.columns--sidebar__sidebar form') ) {
          classlist = 'is-column-filters';
        }

        // set data to button
        // button.classList.add( 'hidden-desktop' );
        button.type = 'button';
        button.classList.add(classlist);
        button.setAttribute( 'data-handler', 'toggle-sidebar' );
        button.setAttribute( 'aria-controls', el.id );
        button.setAttribute( 'data-toggle-open', labels.open );
        button.setAttribute( 'data-toggle-close', labels.close );


        // set initial state
        button.setAttribute( 'aria-expanded', 'false' );
        button.textContent = labels.close;

        // set height based on parents position on page. The header can vary in layout (and height), therefor we take it's parent as the guide.
        button.style.top = Math.round(newTop) + 40 + 'px';

        el.before( button );

        // apply first time
        // if ( !( window.matchMedia( '(min-width: 50em)' ).matches ) ) {
        //   toggle( button );
        // }
      setTimeout(function (el) {
        var parent;
        var newTop = '150';
        var parentOffsets;
        var documentbanner = document.querySelector('.documentbanner');
        var blocksearch = document.querySelector('[data-blocksearch-pageheader]');
        if (documentbanner) {
          parent = documentbanner;
        } else if (blocksearch) {
          parent = blocksearch;
        } else {
          parent = el;
        }
        parentOffsets = parent.getBoundingClientRect();
        if (parentOffsets.top != '0') {
          newTop = parentOffsets.top;
        }
        var trigger = document.querySelector('[data-handler="toggle-sidebar"]');
        trigger.style.top = Math.round(newTop) + 40 + 'px';
      }, 1000, el);
    },
    'stick-sidebar': function( el ) {
      var timer;
      var config;
      var scrollContentElement;

      config = JSON.parse(el.getAttribute('data-config')) || [];
      scrollContentElement = config.scrollContentElement || '.js-scrollContentElement';

      footer = onl.dom.$( '.footer' )[0];
      element = el;
      var calculate = function() {
        referenceTop = element.closest( '.columns--sticky-sidebar' ).getBoundingClientRect().top + getScrollY() + 16;
        if (onl.dom.$('.container > .breadcrumb')[0]) {
          left = onl.dom.$('.container > .breadcrumb')[0].getBoundingClientRect().left;
        } else {
          left = onl.dom.$('.logo')[0].getBoundingClientRect().left;
        }
        if (onl.dom.$('h1')[0]) {
          h1ReferenceTop = onl.dom.$('h1')[0].getBoundingClientRect().bottom;
        }
      };

      var sidebarHeight = document.querySelector('.columns--sticky-sidebar__sidebar > div').offsetHeight;
      var columns = document.querySelectorAll('.columns--sticky-sidebar > div');
      for (var i = 0; i < columns.length; i++) {
        if (!columns[i].classList.contains('columns--sticky-sidebar__sidebar')) {
          // if (sidebarHeight > window.innerHeight) {
            // columns[i].style.minHeight = window.innerHeight + 80 + "px";
          columns[i].style.minHeight = sidebarHeight + 80 + "px";
          // }
        }
      }

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
          updateStickability(config.scrollContentElement);
        }, 10);
      });

      window.addEventListener( 'resize', function() {
        if (resizeTimeout) {
          clearTimeout(resizeTimeout);
        }
        resizeTimeout = window.setTimeout( function() {
          calculate();
          updateStickability(config.scrollContentElement);
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
