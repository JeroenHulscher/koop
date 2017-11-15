var dom = require( 'helpers/dom' );

var getScrollY = function() {
  var supportPageOffset = window.pageXOffset !== undefined;
  var isCSS1Compat = ( ( document.compatMode || '' ) === 'CSS1Compat' );

  return supportPageOffset ? window.pageYOffset : isCSS1Compat ? document.documentElement.scrollTop : document.body.scrollTop;
}

var updateStickability = function( element, footer ) {
  var footerOffset = footer.getBoundingClientRect();
  var elementPosition = element.getBoundingClientRect();
  var elementReferenceTop = element.referenceTop - 16;
  var scrollY = getScrollY();
  var howMuchOfFooterIsVisible = Math.max( ( window.innerHeight - footerOffset.top ), 0 );
  var sidebarHeight = ( window.innerHeight - howMuchOfFooterIsVisible - 32 );
  var onDesktop = window.matchMedia && window.matchMedia( '(min-width: 50em)' ).matches;

  elementPosition.left -= element.offsetLeft - 16;

  if ( scrollY > elementReferenceTop && onDesktop ) {
    element.style.position = 'fixed';
    element.style.top = '1em';
    element.style.left = elementPosition.left + 'px';
    element.style.height = sidebarHeight + 'px';
  }
  else {
    element.removeAttribute( 'style' );
  }

  window.requestAnimationFrame( function() {
    updateStickability( element, footer );
  });
}

var stickSidebar = function( element ) {
  var footer = dom.$( '.footer' )[0];

  element.referenceTop = element.getBoundingClientRect().top;

  window.requestAnimationFrame( function() {
    updateStickability( element, footer );
  });

  window.addEventListener( 'othersites:open', function() {
    window.setTimeout( function() {
      element.referenceTop = element.getBoundingClientRect().top + getScrollY();
    }, 500 );
  })

  window.addEventListener( 'othersites:close', function() {
    element.referenceTop = element.getBoundingClientRect().top + getScrollY();
  })
};

module.exports = stickSidebar;
