'use strict';

window.onl = {

  ui: {
    // detect IE version
    ieversion: function () {
      var rv = -1; // Return value assumes failure.

      if (navigator.appName == 'Microsoft Internet Explorer'){

        var ua = navigator.userAgent,
            re  = new RegExp("MSIE ([0-9]{1,}[\\.0-9]{0,})");

        if (re.exec(ua) !== null){
          rv = parseFloat( RegExp.$1 );
        }
      }
      else if(navigator.appName == "Netscape"){
        /// in IE 11 the navigator.appVersion says 'trident'
        /// in Edge the navigator.appVersion does not say trident
        if(navigator.appVersion.indexOf('Trident') === -1) rv = 12;
        else rv = 11;
      }

      return rv;
    },
    // toggle visibility of `element`
    toggle: function( element ) {
      if ( !onl.ui.isHidden( element ) ) {
        element.setAttribute( 'hidden', true );
      }
      else {
        element.removeAttribute( 'hidden' );
      }
    },
    // hide `element`
    hide: function( element, focusElement ) {
      if ( !onl.ui.isHidden( element ) ) {
        element.setAttribute( 'hidden', true );
      }
      onl.ui.focus( focusElement );
    },
    // show `element`
    show: function( element, focusElement ) {
      if ( onl.ui.isHidden( element ) ) {
        element.removeAttribute( 'hidden' );
      }
      if (focusElement) {
        onl.ui.focus( focusElement );
      }
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
    isTouch: function() {
      return 'ontouchstart' in window;
    },
    hasDragDrop: function() {
      var div = document.createElement( 'div' );
      return (('draggable' in div) || ('ondragstart' in div && 'ondrop' in div)) && 'FormData' in window && 'FileReader' in window;
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
      if ( onl.dom.isDisableable( element ) ) {
        element.disabled = true;
      }
      // if we're not dealing with an element that can be disabled
      // use aria-disabled, but only on <a> elements.
      else if ( element.nodeName === 'A' ) {
        element.setAttribute( 'aria-disabled', true );
      }
    },
    // enable disabled `element`, see `onl.ui.disable` above
    // also restore tabindex
    enable: function( element ) {
      // already enabled
      if ( element._tabIndex === undefined ) {
        return;
      }
      element.tabIndex = element._tabIndex;
      delete element._tabIndex;
      if ( onl.dom.isDisableable( element ) ) {
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
      return onl.dom.$( 'a[href], button, input[type="text"], input[type="radio"], input[type="checkbox"], select', baseElement )
      .filter( onl.dom.isVisibleElement );
    },
    // set up a focus trap within a specific element
    bindFocusTrap: function( element ) {
      element.addEventListener( 'keydown', onl.ui.trapFocus );
    },
    // undo a focus trap within a specifc element
    unbindFocusTrap: function( element ) {
      element.removeEventListener( 'keydown', onl.ui.trapFocus );
    },
    uniqBy: function(a, key) {
      var seen = {};
      return a.filter(function (item) {
        var k = key(item);
        return seen.hasOwnProperty(k) ? false : (seen[k] = true);
      })
    },
    // prevent (shift) tabbing away from an element
    trapFocus: function( event ) {
      var element = event.currentTarget;
      var focusableEls = onl.ui.getFocusableElements( element );
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
      return !onl.ui.isHidden( element, CHECK_FOR_HIDDEN_PARENTS );
    },
    // get all *visible* elements that have a required or data-custom-required attribute
    getRequiredElements: function( element ) {
      return onl.dom.$( '[required]', element )
      .filter( onl.dom.isVisibleElement );
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
      };
    }
  },

  handlers: {
  },

  decorators: {
  },

  handle: function( handlers ) {
    var handler;

    for ( handler in handlers ) {
      if ( !onl.handlers[handler] ) {
        onl.handlers[handler] = handlers[handler];
      }
      else {
        console.log( 'Conflicting handler: ' + handler );
      }
    }
  },

  decorate: function( decorators ) {
    var decorator;

    for ( decorator in decorators ) {
      if ( !onl.decorators[decorator] ) {
        onl.decorators[decorator] = decorators[decorator];
      }
      else {
        console.log( 'Conflicting decorator: ' + decorator );
      }
    }
  },

  run: function( scope ) {
    var WHITESPACE = /\s+/;

    onl.dom.$( '[data-decorator]', scope || document ).forEach( function( element ) {
      var decoratorArr = element.getAttribute( 'data-decorator' )
      .toLowerCase()
      .split( WHITESPACE );

      decoratorArr.forEach( function( decorator ) {
        if ( typeof onl.decorators[ decorator ] === 'function' ) {
          onl.decorators[ decorator ]( element );
        }
      });
    });
  }

};

var pubsub = (function () {
  var topics = {};
  var hOP = topics.hasOwnProperty;

  return {
    subscribe: function (topic, listener) {
      // Create the topic's object if not yet created
      if (!hOP.call(topics, topic)) topics[topic] = [];

      // Add the listener to queue
      var index = topics[topic].push(listener) - 1;

      // Provide handle back for removal of topic
      return {
        remove: function () {
          delete topics[topic][index];
        }
      };
    },
    publish: function (topic, info) {
      // If the topic doesn't exist, or there's no listeners in queue, just leave
      if (!hOP.call(topics, topic)) return;

      // Cycle through topics queue, fire!
      topics[topic].forEach(function (item) {
        item(info != undefined ? info : {});
      });
    }
  };
})();
