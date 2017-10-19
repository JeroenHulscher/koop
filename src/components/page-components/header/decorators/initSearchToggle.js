module.exports = function initSearchToggle( element ) {
  var ui = require( 'helpers/ui' );
  var openText = 'Toon zoekfunctie';
  var closeText = 'Verberg zoekfunctie';
  var toggle = document.createElement( 'button' );

  toggle.textContent = openText;
  toggle.setAttribute( 'aria-controls', element.id );
  toggle.setAttribute( 'aria-expanded', 'false' );
  toggle.setAttribute( 'data-handler', 'toggle-search' );

  element.parentNode.insertBefore( toggle, element );
  ui.hide( element );
};
