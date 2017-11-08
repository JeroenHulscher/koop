var dom = require( 'helpers/dom' );
var toggle = require( 'handlers/toggle' );

module.exports = function addMobileFoldability( element ) {
  var button = document.createElement( 'button' );
  var title = ' ' + dom.$( 'h2', element )[0].textContent || '';
  var labels = {
    open: 'Open' + title,
    close: 'Sluit' + title
  };

  // set data to button
  button.classList.add( 'hidden-desktop' );
  button.type = 'button';
  button.setAttribute( 'data-handler', 'toggle' );
  button.setAttribute( 'aria-controls', element.id );
  button.setAttribute( 'data-toggle-open', labels.open );
  button.setAttribute( 'data-toggle-close', labels.close );

  // set initial state
  button.setAttribute( 'aria-expanded', 'true' );
  button.textContent = labels.close;

  element.parentNode.appendChild( button );

  // apply first time
  if ( ! ( window.matchMedia( '(min-width: 50em)' ).matches ) ) {
    toggle( button );
  }
};
