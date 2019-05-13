(function () {

  'use strict';

  onl.decorate({
    'init-table': function( element ) {
      var div = document.createElement( 'div' );
      var container = div.cloneNode( false );

      element.parentNode.insertBefore( container, element );
      container.classList.add( 'table__container' );
      container.appendChild( element );
    }
  });

})();
