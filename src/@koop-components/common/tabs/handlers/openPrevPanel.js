module.exports = function openTab( element ) {
  var tabs = require( 'common/tabs/tabs' );
  var currentPanel = tabs.getCurrentPanel( element );
  var prevPanel = tabs.getPreviousPanel( currentPanel );

  tabs.openPanel( prevPanel );
};
