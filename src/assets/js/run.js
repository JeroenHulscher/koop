/* @license Fastselect: Copyright(c) 2015 Damir Brekalo */
document.documentElement.className = 'has-js';

// run all decorators on page load
onl.run();

var mutationObserver = new MutationObserver(function(mutations) {
  mutations.forEach(function(mutation) {
    if(mutation.target.dataset.decorator === 'init-accordion') {
      var accordionId = mutation.target.id;
      var accordion = document.querySelector('#'+accordionId);
      accordion.removeAttribute('data-decorator-initialized');
    }
    onl.run();
  });
});

mutationObserver.observe(document.documentElement, {
  attributes: false,
  characterData: false,
  childList: true,
  subtree: true,
  attributeOldValue: false,
  characterDataOldValue: false
});

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
    if ( onl.handlers[handlerName] instanceof Function ) {
      onl.handlers[handlerName]( element, event );
    }
  });

});
