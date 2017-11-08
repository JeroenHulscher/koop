var dom = require( 'helpers/dom' );

var getScrollY = function() {
  var supportPageOffset = window.pageXOffset !== undefined;
  var isCSS1Compat = ( ( document.compatMode || '' ) === 'CSS1Compat' );

  return supportPageOffset ? window.pageYOffset : isCSS1Compat ? document.documentElement.scrollTop : document.body.scrollTop;
}

var updateStickability = function( element, footer ) {
  var footerOffset = footer.getBoundingClientRect();
  var elementPosition = element.getBoundingClientRect();
  var scrollY = getScrollY();
  var howMuchOfFooterIsVisible = Math.max( scrollY - window.innerHeight, 0 );
  var sidebarHeight = ( window.innerHeight - howMuchOfFooterIsVisible - 32 );

  elementPosition.top = elementPosition.top + scrollY - 16;
  elementPosition.left -= element.offsetLeft - 16; // add offset as sidebar can have margin left

  if ( howMuchOfFooterIsVisible > 0 ) {
    sidebarHeight += 32;
  }

  if ( scrollY > elementPosition.top &&
       window.matchMedia &&
       window.matchMedia( '(min-width: 50em)' ).matches ) {
    element.style.position = 'fixed';
    element.style.top = '1em';
    element.style.left = elementPosition.left + 'px';
    element.style.overflow = 'auto';
    element.style.width = element.initialWidth + 'px';
    element.style.height = sidebarHeight + 'px';
  }
  else {
    element.removeAttribute( 'style' );
  }

  requestAnimationFrame( function() {
    updateStickability( element, footer );
  });
}

var stickSidebar = function( element ) {
  var footer = dom.$( '.footer' )[0];

  element.initialWidth = element.clientWidth;

  requestAnimationFrame( function() {
    updateStickability( element, footer );
  });
};

module.exports = stickSidebar;
