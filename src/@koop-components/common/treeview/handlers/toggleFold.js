var ui = require( 'helpers/ui' );
var treeview = require( 'common/treeview/treeview' );

module.exports = function toggleFold( element, event ) {
  var openText = 'Toon onderliggende';
  var closeText = 'Verberg onderliggende';
  var containingLink = element.parentNode;
  var subLists = treeview.getFoldableChildren( containingLink );

  event.preventDefault();

  subLists.forEach( function( toggleable ) {
    if ( ui.isHidden( toggleable ) ) {
      ui.show( toggleable );
      element.textContent = closeText;
      element.setAttribute( 'aria-expanded', 'true' );
    }
    else {
      ui.hide( toggleable );
      element.textContent = openText;
      element.setAttribute( 'aria-expanded', 'false' );
    }
  })
};
