( function() {

  'use strict';

  onl.handle({

    'select-today': function( element, event ) {
      var input = element.getAttribute( 'data-for' );
      var now = new Date();
      var pad = function( num ) {
        if (num < 10) {
          return '0' + num;
        }
        return num;
      };
      event.preventDefault();
      if (!input) {
        return;
      }
      input = document.getElementById(input);
      if (!input) {
        return;
      }
      if (input.type == 'date') {
        input.value = now.getFullYear() + '-' + pad(now.getMonth() + 1) + '-' + pad(now.getDate());
      } else {
        input.value = pad(now.getDate()) + '-' + pad(now.getMonth() + 1) + '-' + now.getFullYear();
      }
    },

    'toggle-option': function ( element ) {
      var option = element.getAttribute('data-for');
      if (!option) {
        return;
      }
      option = document.getElementById(option);
      if (!option) {
        return;
      }
      if (element.checked) {
        option.disabled = false;
      } else {
        option.checked = false;
        option.disabled = true;
      }
    },

    'toggle-extra-options': function( element ) {
      var options = element.getAttribute('data-options');
      var checked = element.checked;
      var otherElements = onl.dom.$( '[data-options="' + options + '"]' );
      if (!options) {
        return;
      }
      options = document.getElementById(options);
      if (!options) {
        return;
      }

      if ( otherElements ) {
        otherElements.forEach( function( input ) {
          if ( input.checked ) {
            checked = true;
          }
        });
      }

      if ( checked && onl.ui.isHidden( options ) ) {
        onl.ui.show( options );
      }
      else if ( !checked ) {
        onl.ui.hide( options );
      }
    },

    'show-extra-options': function( element ) {
      var options = element.getAttribute('data-options');
      if (!options) {
        return;
      }
      options = document.getElementById(options);
      if (!options) {
        return;
      }

      onl.ui.show( options );
    },

    'hide-extra-options': function( element ) {
      var options = element.getAttribute('data-options');
      if (!options) {
        return;
      }
      options = document.getElementById(options);
      if (!options) {
        return;
      }

      onl.ui.hide( options );
    }
  })

  onl.decorate({

    'check-all': function( element ) {
      var elements = element.getAttribute('data-for');

      if ( elements ) {
        elements = onl.dom.$( '[data-set="' + elements + '"]' );
        if ( elements ) {
          elements.forEach( function( input ) {
            input.addEventListener( 'click', function() {
              var checkedAll = true;
              elements.forEach( function( input ) {
                if ( !input.checked ) {
                  checkedAll = false;
                }
              });
              element.checked = checkedAll;
            });
          });
          element.addEventListener( 'click', function() {
            var el = this;

            elements.forEach( function( input ) {
              input.checked = el.checked;
            });
          });
        }
      }
    }
  });

})();
