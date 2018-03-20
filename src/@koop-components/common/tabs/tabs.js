(function () {

  'use strict';

  var tabs = {
    'openPanel': function( element ) {
      var tabsHolder = element.closest( '[data-decorator="init-tabs]' );
      var tabs = ohnl.dom.$( '[role="tab"]', tabsHolder );
      var currentTab = ohnl.dom.$( '[aria-selected="true"]', tabsHolder )[0];
      var currentPanel = document.getElementById( currentTab.getAttribute( 'aria-controls' ) );
      var panelToShow = document.getElementById( element.getAttribute('aria-controls') );

      // hide current panel
      ohnl.ui.hide( currentPanel );

      // show panel to show
      ohnl.ui.show( panelToShow );

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
      var tabsHolder = element.closest( '[data-decorator="init-tabs]' );

      return ohnl.dom.$( '[aria-selected="true"]', tabsHolder )[0];
    },
    switch: function(event) {
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
  };

  ohnl.decorate({
    'init-tabs': function( element ) {
      var theseTabs = ohnl.dom.$( '[role="tab"]', element );
      var panels = ohnl.dom.$( '[role="tabpanel"]', element );

      // set all selected states
      // fire switchTab function when keys are pressed
      theseTabs.forEach( function( tab ) {
        tab.setAttribute( 'aria-selected', 'false' );
        tab.addEventListener( 'keyup', tabs.switch );
      });

      // hide all panels
      panels.forEach( function( panel ) {
        ohnl.ui.hide( panel );
      });

      // show first panel
      ohnl.ui.show( panels[0] );

      // give first tab selected state
      theseTabs[0].setAttribute( 'aria-selected', 'true' );
    }
  });

  ohnl.handle({
    'open-panel': function( element, event ) {
      event.preventDefault();
      tabs.openPanel( element );
    },
    'open-next-panel': function( element ) {
      var currentPanel = tabs.getCurrentPanel( element );
      var nextPanel = tabs.getNextPanel( currentPanel );
      tabs.openPanel( nextPanel );
    },
    'open-previous-panel': function( element ) {
      var currentPanel = tabs.getCurrentPanel( element );
      var prevPanel = tabs.getPreviousPanel( currentPanel );
      tabs.openPanel( prevPanel );
    }
  });

})();