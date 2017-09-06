module.exports = function openTab( element ) {
  var dom = require( 'helpers/dom' );
  var ui = require( 'helpers/ui' );
  var tabsHolder = element.closest( '[data-decorator="init-tabs]' );
  var tabs = dom.$( '[role="tab"]', tabsHolder );
  var currentTab = dom.$( '[aria-selected="true"]', tabsHolder )[0];
  var currentPanel = document.getElementById( currentTab.getAttribute( 'aria-controls' ) );
  var panelToShow = document.getElementById( element.getAttribute('aria-controls') );

  // hide current panel
  ui.hide( currentPanel );

  // show panel to show
  ui.show( panelToShow );

  // update aria-selected attributes
  tabs.forEach( function( tab ) {
    tab.setAttribute( 'aria-selected', 'false' );
  });

  element.setAttribute( 'aria-selected', 'true' );
}
