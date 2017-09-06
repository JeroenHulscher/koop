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
  var openTab = require( 'common/tabs/handlers/openTab' );
  var currentTab = event.target;
  var previousTab;
  var nextTab;

  if ( currentTab.parentElement.nextElementSibling ) {
    nextTab = currentTab.parentElement.nextElementSibling.firstElementChild;
  }
  else {
    nextTab = currentTab.parentElement.parentElement.firstElementChild.firstElementChild;
  }

  if ( currentTab.parentElement.previousElementSibling ) {
    previousTab = currentTab.parentElement.previousElementSibling.firstElementChild;
  }
  else {
    previousTab = currentTab.parentElement.parentElement.lastElementChild.lastElementChild;
  }

  if ( event.which === 39 ) {
    nextTab.focus();
    openTab( nextTab );
  }

  if ( event.which === 37 ) {
    previousTab.focus();
    openTab( previousTab );
  }
}
