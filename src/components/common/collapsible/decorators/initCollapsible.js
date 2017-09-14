var dom = require( 'helpers/dom' );
var collapsibles = require( '../collapsibles' );

module.exports = function initCollapsible( element ) {
  var showInitially = dom.$('.collapsible--initially-visible', element ).length > 0;

  if ( showInitially === true ){
    collapsibles.show( element );
  }
  else {
    collapsibles.hide( element );
  }
};
