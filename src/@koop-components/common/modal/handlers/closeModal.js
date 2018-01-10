module.exports = function openModal( element ) {
  var modal = require( 'core/modal' );
  var modalElement;

  if ( element.getAttribute( 'data-modal' ) ) {
    modalElement = document.getElementById( element.getAttribute( 'data-modal' ) );
  }
  else {
    modalElement = element.closest( '.modal' );
  }

  modal.close( modalElement );
};
