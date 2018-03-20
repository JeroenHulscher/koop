( function() {

  'use strict';

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