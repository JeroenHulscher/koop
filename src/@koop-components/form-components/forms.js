onl.handle({
  'check-all': function( element, event ) {
    var which = element.getAttribute('data-which');
    var el = which && document.getElementById( which );

    if ( el ) {
      onl.dom.$( 'input', el ).forEach( function( input ) {
        input.checked = element.checked;
      });
    }
  }
});