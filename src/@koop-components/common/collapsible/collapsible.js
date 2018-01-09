var dom = require( 'helpers/dom' );
var ui = require( 'helpers/ui' );

module.exports = {
  show: function ( collapsible ) {
    dom.$( '.collapsible__header a', collapsible )[0].setAttribute( 'aria-expanded', 'true' );
    ui.show( dom.$( '.collapsible__content', collapsible )[0] );
  },
  hide: function ( collapsible ) {
    dom.$( '.collapsible__header a', collapsible )[0].setAttribute( 'aria-expanded', 'false' );
    ui.hide( dom.$( '.collapsible__content', collapsible )[0] );
  },
  isCollapsed: function ( collapsible ) {
    return ui.isHidden( dom.$( '.collapsible__content', collapsible )[0] );
  }
};
