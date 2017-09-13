module.exports = function initTabs( element ) {
  var dom = require( 'helpers/dom' );
  var ui = require( 'helpers/ui' );
  var tabs = dom.$( '[role="tab"]', element );
  var panels = dom.$( '[role="tabpanel"]', element );

  // set all selected states
  // fire switchTab function when keys are pressed
  tabs.forEach( function( tab ) {
    tab.setAttribute( 'aria-selected', 'false' );
    tab.addEventListener( 'keyup', switchTab );
  });

  // hide all panels
  panels.forEach( function( panel ) {
    ui.hide( panel );
  });

  // show first panel
  ui.show( panels[0] );

  // give first tab selected state
  tabs[0].setAttribute( 'aria-selected', 'true' );
};

function switchTab( event ) {
  var ui = require( 'helpers/ui' );
  var tabs = require( 'common/tabs/tabs' );
  var currentPanel = event.target;
  var nextPanel = tabs.getNextPanel( currentPanel );
  var previousPanel = tabs.getPreviousPanel( currentPanel );

  if ( event.which === 39 ) {
    nextPanel.focus();
    tabs.openPanel( nextPanel );
  }

  if ( event.which === 37 ) {
    previousPanel.focus();
    tabs.openPanel( previousPanel );
  }
}
