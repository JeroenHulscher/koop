(function () {

  'use strict';

  var collapsibles = {
    show: function ( collapsible ) {
      onl.dom.$( '.collapsible__header a', collapsible )[0].setAttribute( 'aria-expanded', 'true' );
      onl.ui.show( onl.dom.$( '.collapsible__content', collapsible )[0] );
    },
    hide: function ( collapsible ) {
      onl.dom.$( '.collapsible__header a', collapsible )[0].setAttribute( 'aria-expanded', 'false' );
      onl.ui.hide( onl.dom.$( '.collapsible__content', collapsible )[0] );
    },
    isCollapsed: function ( collapsible ) {
      return onl.ui.isHidden( onl.dom.$( '.collapsible__content', collapsible )[0] );
    }
  };

  onl.handle({
    'toggle-collapsible': function( element, event ) {
      var collapsibleElement = element.closest( '.collapsible' );
      var collapsiblesParentContainer = collapsibleElement.parentElement;
      var collapsibleSiblings = onl.dom.$( '.collapsible', collapsiblesParentContainer ).filter( function( element ) {
        return element.id === collapsibleElement.id;
      });

      event.preventDefault();

      if ( collapsibles.isCollapsed( collapsibleElement ) ) {
        collapsibleSiblings.forEach( function ( sibling ) {
          if ( !collapsibles.isCollapsed( sibling ) )
            collapsibles.hide( sibling );
        } );
        collapsibles.show( collapsibleElement );
      }
      else {
        collapsibles.hide( collapsibleElement );
      }
    }
  });

  onl.decorate({
    'init-collapsible': function( element ) {
      var showInitially = onl.dom.$('.collapsible--initially-visible', element ).length > 0;

      if ( showInitially === true ){
        collapsibles.show( element );
      }
      else {
        collapsibles.hide( element );
      }
    }
  });

})();