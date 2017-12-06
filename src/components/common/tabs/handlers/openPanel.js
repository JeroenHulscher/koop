module.exports = function openTab( element, event ) {
  var tabs = require( 'common/tabs/tabs' );

  event.preventDefault();

  tabs.openPanel( element );
};
