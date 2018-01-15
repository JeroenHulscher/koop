( function() {

  // String.prototype.trim
  if ( !String.prototype.trim ) {
    String.prototype.trim = function() {
      return this.replace( /^\s+|\s+$/g, '' );
    };
  }

  // Array.prototype.indexOf
  if ( !Array.prototype.indexOf ) {
    Array.prototype.indexOf = function( item ) {
      var i = 0;
      var len = this.length;

      for ( ; i < len; i++ ) {
        if ( i in this && this[i] === item ) {
          return i;
        }
      }
      return -1;
    };
  }

  // Array.prototype.forEach
  if ( !Array.prototype.forEach ) {
    Array.prototype.forEach = function( callback, thisArg ) {
      var arrayObject = Object( this );
      var len = arrayObject.length >>> 0;
      var i = 0;

      if ( typeof callback !== 'function' ) {
        throw new TypeError();
      }
      for ( ; i < len; i++ ) {
        if ( arrayObject.hasOwnProperty( i ) ) {
          callback.call( thisArg || undefined, arrayObject[i], i, arrayObject );
        }
      }
      return undefined;
    };
  }

  // Element.matches
  if ( !Element.prototype.matches ) {
    Element.prototype.matches =
    Element.prototype.matchesSelector ||
    Element.prototype.mozMatchesSelector ||
    Element.prototype.msMatchesSelector ||
    Element.prototype.oMatchesSelector ||
    Element.prototype.webkitMatchesSelector || function( selector ) {
      var matches = ( this.document || this.ownerDocument ).querySelectorAll( selector );
      var i = matches.length;

      while ( --i >= 0 && matches.item( i ) !== this ) {
        // nop
      }
      return i > -1;
    };
  }

  // Element.closest
  if ( !Element.prototype.closest ) {
    Element.prototype.closest = function( selector ) {
      var element = this;

      // document has no .matches
      while ( element.matches && !element.matches( selector ) ) {
        element = element.parentNode;
      }
      return element.matches ? element : null;
    };
  }


  // Full polyfill for browsers with no classList support
  // Including IE < Edge missing SVGElement.classList
  // adapted from https://github.com/eligrey/classList.js/
  if ( !( 'classList' in document.createElement( '_' ) )
    || document.createElementNS && !( 'classList' in document.createElementNS( 'http://www.w3.org/2000/svg', 'g' ) ) ) {

    ( function( view ) {
      'use strict';
      var DOMEx;
      var checkTokenAndGetIndex;
      var ClassList;
      var classListGetter;
      var classListPropertyDescriptor;

      if ( !( 'Element' in view ) ) {
        return;
      }

      // Vendors: please allow content code to instantiate DOMExceptions
      DOMEx = function( type, message ) {
        this.name = type;
        this.code = DOMException[type];
        this.message = message;
      };

      // Most DOMException implementations don't allow calling DOMException's toString()
      // on non-DOMExceptions. Error's toString() is sufficient here.
      DOMEx.prototype = Error.prototype;

      checkTokenAndGetIndex = function( classList, token ) {
        if ( token === '' ) {
          throw new DOMEx( 'SYNTAX_ERR', 'An invalid or illegal string was specified' );
        }
        if ( /\s/.test( token ) ) {
          throw new DOMEx( 'INVALID_CHARACTER_ERR', 'String contains an invalid character' );
        }
        return [].indexOf.call( classList, token );
      };

      ClassList = function( elem ) {
        var trimmedClasses = String.prototype.trim.call( elem.getAttribute( 'class' ) || '' );
        var classes = trimmedClasses ? trimmedClasses.split( /\s+/ ) : [];
        var len = classes.length;
        var i = 0;

        for ( ; i < len; i++ ) {
          this.push( classes[i]);
        }
        this._updateClassName = function() {
          elem.setAttribute( 'class', this.toString() );
        };
      };

      ClassList.prototype = [];

      classListGetter = function() {
        return new ClassList( this );
      };

      ClassList.prototype.item = function( i ) {
        return this[i] || null;
      };

      ClassList.prototype.contains = function( token ) {
        token += '';
        return checkTokenAndGetIndex( this, token ) !== -1;
      };

      ClassList.prototype.add = function() {
        var tokens = arguments;
        var i = 0;
        var l = tokens.length;
        var token;
        var updated = false;

        do {
          token = tokens[i] + '';
          if ( checkTokenAndGetIndex( this, token ) === -1 ) {
            this.push( token );
            updated = true;
          }
        } while ( ++i < l );

        if ( updated ) {
          this._updateClassName();
        }
      };

      ClassList.prototype.remove = function() {
        var tokens = arguments;
        var i = 0;
        var l = tokens.length;
        var token;
        var updated = false;
        var index;

        do {
          token = tokens[i] + '';
          index = checkTokenAndGetIndex( this, token );
          while ( index !== -1 ) {
            this.splice( index, 1 );
            updated = true;
            index = checkTokenAndGetIndex( this, token );
          }
        } while ( ++i < l );

        if ( updated ) {
          this._updateClassName();
        }
      };

      ClassList.prototype.toggle = function( token, force ) {
        var result;
        var method;

        token += '';
        result = this.contains( token );
        method = result ? force !== true && 'remove' : force !== false && 'add';

        if ( method ) {
          this[method]( token );
        }

        if ( force === true || force === false ) {
          return force;
        }
        else {
          return !result;
        }
      };

      ClassList.prototype.toString = function() {
        return this.join( ' ' );
      };

      if ( Object.defineProperty ) {
        classListPropertyDescriptor = {
          get: classListGetter,
          enumerable: true,
          configurable: true
        };
        try {
          Object.defineProperty( view.Element.prototype, 'classList', classListPropertyDescriptor );
        }
        catch ( exception ) { // IE 8 doesn't support enumerable:true
          if ( exception.number === -0x7FF5EC54 ) {
            classListPropertyDescriptor.enumerable = false;
            Object.defineProperty( view.Element.prototype, 'classList', classListPropertyDescriptor );
          }
        }
      }
      else if ( Object.prototype.__defineGetter__ ) {
        view.Element.prototype.__defineGetter__( 'classList', classListGetter );
      }

    }( self ) );

  }
  else {
    // There is full or partial native classList support, so just check if we need
    // to normalize the add/remove and toggle APIs.

    ( function() {
      'use strict';
      var testElement = document.createElement( '_' );
      var createMethod;
      var original;

      testElement.classList.add( 'c1', 'c2' );

      // Polyfill for IE 10/11 and Firefox <26, where classList.add and
      // classList.remove exist but support only one argument at a time.
      if ( !testElement.classList.contains( 'c2' ) ) {
        createMethod = function( method ) {
          var original = DOMTokenList.prototype[method];

          DOMTokenList.prototype[method] = function( token ) {
            var i;
            var len = arguments.length;

            for ( i = 0; i < len; i++ ) {
              token = arguments[i];
              original.call( this, token );
            }
          };
        };
        createMethod( 'add' );
        createMethod( 'remove' );
      }

      testElement.classList.toggle( 'c3', false );

      // Polyfill for IE 10 and Firefox <24, where classList.toggle does not
      // support the second argument.
      if ( testElement.classList.contains( 'c3' ) ) {
        original = DOMTokenList.prototype.toggle;

        DOMTokenList.prototype.toggle = function( token, force ) {
          if ( 1 in arguments && !this.contains( token ) === !force ) {
            return force;
          }
          else {
            return original.call( this, token );
          }
        };
      }

      testElement = null;
    }() );

  }

  //ChildNode.before()

  ( function( arr ) {
    arr.forEach( function( item ) {
      if ( item.hasOwnProperty( 'before' ) ) {
        return;
      }
      Object.defineProperty( item, 'before', {
        configurable: true,
        enumerable: true,
        writable: true,
        value: function before() {
          var argArr = Array.prototype.slice.call( arguments );
          var docFrag = document.createDocumentFragment();

          argArr.forEach( function( argItem ) {
            var isNode = argItem instanceof Node;

            docFrag.appendChild( isNode ? argItem : document.createTextNode( String( argItem ) ) );
          });

          this.parentNode.insertBefore( docFrag, this );
        }
      });
    });
  })([ Element.prototype, CharacterData.prototype, DocumentType.prototype ]);

}() );
