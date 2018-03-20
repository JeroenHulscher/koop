'use strict';

window.ohnl = {

  ui: {
    // toggle visibility of `element`
    toggle: function( element ) {
      if ( !ohnl.ui.isHidden( element ) ) {
        element.setAttribute( 'hidden', true );
      }
      else {
        element.removeAttribute( 'hidden' );
      }
    },
    // hide `element`
    hide: function( element, focusElement ) {
      if ( !ohnl.ui.isHidden( element ) ) {
        element.setAttribute( 'hidden', true );
      }
      ohnl.ui.focus( focusElement );
    },
    // show `element`
    show: function( element, focusElement ) {
      if ( ohnl.ui.isHidden( element ) ) {
        element.removeAttribute( 'hidden' );
      }
      ohnl.ui.focus( focusElement );
    },
    // check if `element` is hidden
    isHidden: function( element, checkForHiddenParents ) {
      var hasHiddenParents = false;

      if ( checkForHiddenParents ) {
        hasHiddenParents = !!element.closest( '[hidden]' );
      }
      return element.hasAttribute( 'hidden' ) || checkForHiddenParents && hasHiddenParents;
    },
    // focus `element`
    focus: function( element ) {
      if ( element ) {
        if ( !element.hasAttribute( 'tabindex' ) ) {
          element.setAttribute( 'tabindex', '0' );
        }
        if ( typeof element.focus === 'function' ) {
          if ( window.requestAnimationFrame ) {
            window.requestAnimationFrame( function() {
              element.focus();
            });
          }
          else {
            element.focus();
          }
        }
      }
    },
    debounce: function( originalFunction, delay ) {
      var timer = null;

      return function() {
        var context = this;
        var args = arguments;

        clearTimeout( timer );

        timer = setTimeout( function() {
          originalFunction.apply( context, args );
        }, delay );
      };
    },
    // disable enabled `element`
    // prefer native `element.disabled`, for `<a>` use the aria-disabled attribute
    // also set tabindex to -1 to take the element out of tab order
    disable: function( element ) {
      // already disabled
      if ( element._tabIndex !== undefined ) {
        return;
      }
      element._tabIndex = element.tabIndex;
      element.tabIndex = -1;
      if ( ohnl.dom.isDisableable( element ) ) {
        element.disabled = true;
      }
      // if we're not dealing with an element that can be disabled
      // use aria-disabled, but only on <a> elements.
      else if ( element.nodeName === 'A' ) {
        element.setAttribute( 'aria-disabled', true );
      }
    },
    // enable disabled `element`, see `ohnl.ui.disable` above
    // also restore tabindex
    enable: function( element ) {
      // already enabled
      if ( element._tabIndex === undefined ) {
        return;
      }
      element.tabIndex = element._tabIndex;
      delete element._tabIndex;
      if ( ohnl.dom.isDisableable( element ) ) {
        element.disabled = false;
      }
      // if we're not dealing with an element that can be disabled
      // use aria-disabled, but only on <a> elements.
      else if ( element.nodeName === 'A' ) {
        element.setAttribute( 'aria-disabled', false );
      }
    },
    // basic way of getting focusable elements in `baseElement`
    getFocusableElements: function( baseElement ) {
      return ohnl.dom.$( 'a[href], button, input[type="text"], input[type="radio"], input[type="checkbox"], select', baseElement )
      .filter( ohnl.dom.isVisibleElement );
    },
    // set up a focus trap within a specific element
    bindFocusTrap: function( element ) {
      element.addEventListener( 'keydown', ohnl.ui.trapFocus );
    },
    // undo a focus trap within a specifc element
    unbindFocusTrap: function( element ) {
      element.removeEventListener( 'keydown', ohnl.ui.trapFocus );
    },
    // prevent (shift) tabbing away from an element
    trapFocus: function( event ) {
      var element = event.currentTarget;
      var focusableEls = ohnl.ui.getFocusableElements( element );
      var firstFocusableEl = focusableEls[0];
      var lastFocusableEl = focusableEls[focusableEls.length - 1];
      var isTabPressed = ( event.key === 'Tab' || event.keyCode === 9 );

      if ( !isTabPressed ) {
        return;
      }

      if ( event.shiftKey ) /* shift + tab */ {
        if ( document.activeElement === firstFocusableEl ) {
          lastFocusableEl.focus();
          event.preventDefault();
        }
      }
      else /* tab */ {
        if ( document.activeElement === lastFocusableEl ) {
          firstFocusableEl.focus();
          event.preventDefault();
        }
      }
    }
  },

  dom: {
    // convenience function that returns an Array of elements that matches selectors
    $: function( selectors, baseElement ) {
      var elements = ( baseElement || document ).querySelectorAll( selectors );

      return Array.prototype.slice.call( elements );
    },
    // find a DOM element based on a href
    getElementFromHref: function( href ) {
      var id = href.match( /#(.+)/ )[1];

      return document.getElementById( id );
    },
    // return an array of existing elements from an array of ids.
    getExistingElementsByIds: function( ids ) {
      return ids
      .map( function( id ) {
        return document.getElementById( id );
      })
      .filter( function( element ) {
          // only return existing elements
          return element;
        });
    },
    // check if an element can natively be disabled
    isDisableable: function( element ) {
      return Object.getPrototypeOf( element ).hasOwnProperty( 'disabled' );
    },
    // find out if an element is visible, uses ui#isHidden
    isVisibleElement: function( element ) {
      var CHECK_FOR_HIDDEN_PARENTS = true;

      // only return elements that are not hidden and not inside a hidden parent
      return !ohnl.ui.isHidden( element, CHECK_FOR_HIDDEN_PARENTS );
    },
    // get all *visible* elements that have a required or data-custom-required attribute
    getRequiredElements: function( element ) {
      return ohnl.dom.$( '[required]', element )
      .filter( ohnl.dom.isVisibleElement );
    },
    // return either the custom required element or the actual required element
    getRequiredElement: function( element ) {
      return element.querySelector( element.querySelector( '[required]' ) );
    },
    offset: function( element ) {
      var rect = element.getBoundingClientRect();
      var scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
      var scrollTop = window.pageYOffset || document.documentElement.scrollTop;

      return {
        top: rect.top + scrollTop,
        left: rect.left + scrollLeft
      }
    }
  },

  handlers: {
  },

  decorators: {
  },

  handle: function(handlers) {
    for (var handler in handlers) {
      if (!ohnl.handlers[handler]) {
        ohnl.handlers[handler] = handlers[handler];
      } else {
        console.log('Conflicting handler: ' + handler);
      }
    }
  },

  decorate: function(decorators) {
    for (var decorator in decorators) {
      if (!ohnl.decorators[decorator]) {
        ohnl.decorators[decorator] = decorators[decorator];
      } else {
        console.log('Conflicting decorator: ' + decorator);
      }
    }
  },

  run: function(scope) {
    var WHITESPACE = /\s+/;

    ohnl.dom.$( '[data-decorator]', scope || document ).forEach( function( element ) {
      var decoratorArr = element.getAttribute( 'data-decorator' )
      .toLowerCase()
      .split( WHITESPACE );

      decoratorArr.forEach( function( decorator ) {
        if ( typeof ohnl.decorators[ decorator ] === 'function' ) {
          ohnl.decorators[ decorator ]( element );
        }
      });
    });
  }

};