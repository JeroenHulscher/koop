module.exports = function addFoldability( element ) {
  var openText = 'Toon onderliggende';
  var closeText = 'Verberg onderliggende';
  var needsFoldability = element.parentNode.children.length > 1;
  var toggleButton;

  console.log( element );

  if ( needsFoldability ) {
    toggleButton = document.createElement( 'button' )
    toggleButton.type = 'button';
    toggleButton.textContent = closeText;
    toggleButton.setAttribute( 'data-handler', 'toggle-fold' );

    element.appendChild( toggleButton );
  }
};
