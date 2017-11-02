var dom = require( 'helpers/dom' );

var toggleStickability = function( event, element, elementPosition ) {
  console.log( 'scrollY: ' + window.scrollY + ', elementPos.top: ' + elementPosition.top );
  var footerNotInViewport = true;

  if ( window.scrollY > elementPosition.top && footerNotInViewport ) {
    element.setAttribute( 'style', 'position: fixed; top: 0; left: ' + elementPosition.left + 'px; overflow: scroll; max-height: 100vh' );
  }
  else {
    element.removeAttribute( 'style' );
  }
}

module.exports = function stickSidebar( element ) {
  var elementPosition = dom.offset( element );

  elementPosition.left -= element.offsetLeft; // add offset as sidebar can have margin left

  window.addEventListener( 'scroll', function( event ) {
    toggleStickability( event, element, elementPosition );
  });
};

