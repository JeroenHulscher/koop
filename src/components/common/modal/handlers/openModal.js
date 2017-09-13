module.exports = function openModal( element ) {
  var modal = require( 'core/modal' );
  var modalElement = document.getElementById( element.getAttribute( 'data-modal' ) );

  modal.open( modalElement );
};
