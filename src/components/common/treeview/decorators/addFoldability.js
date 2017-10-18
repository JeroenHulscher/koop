var treeview = require( 'common/treeview/treeview' );

module.exports = function addFoldability( element ) {
  var openText = 'Toon onderliggende';
  var closeText = 'Verberg onderliggende';
  var foldableChildren = treeview.getFoldableChildren( element );
  var foldableChildrenIDRef = treeview.getFoldableChildrenIDRef( foldableChildren );
  var needsFoldability = foldableChildren.length > 0;
  var toggleButton;

  console.log( element );

  if ( needsFoldability ) {
    toggleButton = document.createElement( 'button' )
    toggleButton.type = 'button';
    toggleButton.textContent = closeText;
    toggleButton.setAttribute( 'data-handler', 'toggle-fold' );

    if ( foldableChildrenIDRef ) {
      toggleButton.setAttribute( 'aria-controls', foldableChildrenIDRef );
    }

    element.appendChild( toggleButton );
  }
};
