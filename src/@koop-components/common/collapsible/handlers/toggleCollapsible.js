var dom = require( 'helpers/dom' );
var collapsibles = require( '../collapsible' );

module.exports = function ( element, event ) {
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
