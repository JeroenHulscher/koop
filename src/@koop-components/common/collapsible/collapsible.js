(function () {

  'use strict';

  var collapsibles = {
    show: function ( collapsible ) {
      dom.$( '.collapsible__header a', collapsible )[0].setAttribute( 'aria-expanded', 'true' );
      ui.show( dom.$( '.collapsible__content', collapsible )[0] );
    },
    hide: function ( collapsible ) {
      dom.$( '.collapsible__header a', collapsible )[0].setAttribute( 'aria-expanded', 'false' );
      ui.hide( dom.$( '.collapsible__content', collapsible )[0] );
    },
    isCollapsed: function ( collapsible ) {
      return ui.isHidden( dom.$( '.collapsible__content', collapsible )[0] );
    }
  };

  onl.handle({
    'toggle-collapsible': function( element, event ) {
      var collapsibleElement = element.closest( '.collapsible' );
      var collapsiblesParentContainer = collapsibleElement.parentElement;
      var collapsibleSiblings = dom.$( '.collapsible', collapsiblesParentContainer ).filter( function( element ) {
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
      var showInitially = dom.$('.collapsible--initially-visible', element ).length > 0;

      if ( showInitially === true ){
        collapsibles.show( element );
      }
      else {
        collapsibles.hide( element );
      }
    }
  });

})();