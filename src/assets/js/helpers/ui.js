var ui = {
  // toggle visibility of `element`
  toggle: function( element ) {
    if ( !ui.isHidden( element ) ) {
      element.setAttribute( 'hidden', true );
    }
    else {
      element.removeAttribute( 'hidden' );
    }
  },
  // hide `element`
  hide: function( element, focusElement ) {
    if ( !ui.isHidden( element ) ) {
      element.setAttribute( 'hidden', true );
    }
    ui.focus( focusElement );
  },
  // show `element`
  show: function( element, focusElement ) {
    if ( ui.isHidden( element ) ) {
      element.removeAttribute( 'hidden' );
    }
    ui.focus( focusElement );
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
      if ( element.nodeName === 'DIV' && !element.hasAttribute( 'tabindex' ) ) {
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
      var arguments = arguments;

      clearTimeout( timer );

      timer = setTimeout( function() {
        originalFunction.apply( context, arguments );
      }, delay );
    };
  },
  // disable enabled `element`
  // prefer native `element.disabled`, for `<a>` use the aria-disabled attribute
  // also set tabindex to -1 to take the element out of tab order
  disable: function( element ) {
    var dom = require( 'helpers/dom' );

    // already disabled
    if ( element._tabIndex !== undefined ) {
      return;
    }
    element._tabIndex = element.tabIndex;
    element.tabIndex = -1;
    if ( dom.isDisableable( element ) ) {
      element.disabled = true;
    }
    // if we're not dealing with an element that can be disabled
    // use aria-disabled, but only on <a> elements.
    else if ( element.nodeName === 'A' ) {
      element.setAttribute( 'aria-disabled', true );
    }
  },
  // enable disabled `element`, see `ui.disable` above
  // also restore tabindex
  enable: function( element ) {
    var dom = require( 'helpers/dom' );

    // already enabled
    if ( element._tabIndex === undefined ) {
      return;
    }
    element.tabIndex = element._tabIndex;
    delete element._tabIndex;
    if ( dom.isDisableable( element ) ) {
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
    var dom = require( 'helpers/dom' );

    return dom.$( 'a[href], button, input[type="text"], input[type="radio"], input[type="checkbox"], select', baseElement )
      .filter( dom.isVisibleElement );
  },
  // set up a focus trap within a specific element
  bindFocusTrap: function( element ) {
    element.addEventListener( 'keydown', ui.trapFocus );
  },
  // undo a focus trap within a specifc element
  unbindFocusTrap: function( element ) {
    element.removeEventListener( 'keydown', ui.trapFocus );
  },
  // prevent (shift) tabbing away from an element
  trapFocus: function( event ) {
    var element = event.currentTarget;
    var focusableEls = ui.getFocusableElements( element );
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
};

module.exports = ui;
