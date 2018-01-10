module.exports = function openNextPanel( element ) {
  var dom = require( 'helpers/dom' );
  var tabs = require( 'common/tabs/tabs' );
  var currentPanel = tabs.getCurrentPanel( element );
  var nextPanel = tabs.getNextPanel( currentPanel );

  tabs.openPanel( nextPanel );
};
