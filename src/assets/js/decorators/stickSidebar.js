var dom = require( 'helpers/dom' );

var updateStickability = function( element, initialWidth, elementPosition, footerOffset ) {
  var howMuchOfFooterIsVisible = Math.max( window.scrollY - footerOffset.top + window.innerHeight, 0 );
  var sidebarHeight = window.innerHeight;
  var newHeight = ( sidebarHeight - howMuchOfFooterIsVisible - 32 ) + 'px';

  if ( window.scrollY > elementPosition.top ) {
    element.scrollTop = 0;
  }

  if ( window.scrollY > elementPosition.top &&
       window.matchMedia &&
       window.matchMedia( '(min-width: 50em)' ).matches ) {
    element.style.position = 'fixed';
    element.style.top = '1em';
    element.style.left = elementPosition.left + 'px';
    element.style.overflow = 'auto';
    element.style.width = initialWidth + 'px';
    element.style.height = newHeight;
  }
  else {
    element.removeAttribute( 'style' );
  }

  window.requestAnimationFrame( function() {
    updateStickability( element, initialWidth, elementPosition, footerOffset );
  });
}

var stickSidebar = function( element ) {
  var elementPosition = dom.offset( element );
  var initialWidth = element.clientWidth;
  var footer = dom.$( '.footer' )[0];
  var footerOffset = dom.offset( footer );

  elementPosition.top -= 16;
  elementPosition.left -= element.offsetLeft - 16; // add offset as sidebar can have margin left

  window.requestAnimationFrame( function() {
    updateStickability( element, initialWidth, elementPosition, footerOffset );
  });
};

module.exports = stickSidebar;
