var ui = require( 'helpers/ui' );

module.exports = function toggleFold( element ) {
  var openText = 'Toon onderliggende';
  var closeText = 'Verberg onderliggende';
  var containingLink = element.parentNode;
  var containingListItem = containingLink.parentNode;
  var subLists = Array.prototype.slice.call( containingListItem.children, 1 );

  console.log( subLists );

  subLists.forEach( function( toggleable ) {
    if ( ui.isHidden( toggleable ) ) {
      ui.show( toggleable );
      element.textContent = closeText;
    }
    else {
      ui.hide( toggleable );
      element.textContent = openText;
    }
  })
};
