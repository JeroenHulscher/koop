document.documentElement.className = 'has-js';

// run all decorators on page load
ohnl.run();

// bind click handler so that handlers run on click
// of elements with data-handler="handler"
document.addEventListener( 'click', function handleClick( event ) {
  var element = event.target;
  var handler = ( element.getAttribute( 'data-handler' ) || '' ).toLowerCase();
  var isDisabled = element.getAttribute( 'aria-disabled' ) === 'true';

  // no handler, bail early
  if ( !handler ) {
    return;
  }

  // honor clicks with modifier keys
  if ( element.nodeName === 'A' && ( event.shiftKey || event.metaKey || event.ctrlKey ) ) {
    return true;
  }

  // dismiss clicks on aria-disabled="true" elements
  if ( isDisabled ) {
    event.preventDefault();
    return;
  }

  handler.split( /\s+/ ).forEach( function( handlerName ) {
    if ( ohnl.handlers[handlerName] instanceof Function ) {
      ohnl.handlers[handlerName]( element, event );
    }
  });

});