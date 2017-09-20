module.exports = {
  // open panel based from tab (based on its aria-controls attribute)
  'openPanel': function( element ) {
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
  },
  // get next panel element based on current tab element
  'getNextPanel': function( currentPanel ) {
    if ( currentPanel.parentElement.nextElementSibling ) {
      return currentPanel.parentElement.nextElementSibling.firstElementChild;
    }
    else {
      return currentPanel.parentElement.parentElement.firstElementChild.firstElementChild;
    }
  },
  // get previous panel element based on current tab element
  'getPreviousPanel': function( currentPanel ) {
    if ( currentPanel.parentElement.previousElementSibling ) {
      return currentPanel.parentElement.previousElementSibling.firstElementChild;
    }
    else {
      return currentPanel.parentElement.parentElement.lastElementChild.lastElementChild;
    }
  },
  // get current panel element from any element inside tabs element
  'getCurrentPanel': function( element ) {
    var dom = require( 'helpers/dom' );
    var tabsHolder = element.closest( '[data-decorator="init-tabs]' );

    return dom.$( '[aria-selected="true"]', tabsHolder )[0];
  }
};
