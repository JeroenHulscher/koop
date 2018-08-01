( function() {

  'use strict';

  var tabs = {
    openPanel: function( element ) {
      var tabsHolder = element.closest( '[data-decorator="init-tabs"]' );
      var tabs = onl.dom.$( '[role="tab"]', tabsHolder );
      var currentTab = onl.dom.$( '[aria-selected="true"]', tabsHolder )[0];
      // var currentPanel = document.getElementById( currentTab.getAttribute( 'aria-controls' ) );
      var currentPanel = onl.dom.$( '#' + currentTab.getAttribute( 'aria-controls' ), tabsHolder )[0];
      var panelToShow = onl.dom.$( '#' + element.getAttribute( 'aria-controls' ), tabsHolder )[0];

      // set tab-hash in url;
      window.location.hash = element.getAttribute( 'aria-controls' );

      // hide current panel
      onl.ui.hide( currentPanel );

      // show panel to show
      onl.ui.show( panelToShow );

      // update aria-selected attributes
      tabs.forEach( function( tab ) {
        tab.setAttribute( 'aria-selected', 'false' );
      });

      element.setAttribute( 'aria-selected', 'true' );
    },
    // get next panel element based on current tab element
    getNextPanel: function( currentPanel ) {
      if ( currentPanel.parentElement.nextElementSibling ) {
        return currentPanel.parentElement.nextElementSibling.firstElementChild;
      }
      else {
        return currentPanel.parentElement.parentElement.firstElementChild.firstElementChild;
      }
    },
    // get previous panel element based on current tab element
    getPreviousPanel: function( currentPanel ) {
      if ( currentPanel.parentElement.previousElementSibling ) {
        return currentPanel.parentElement.previousElementSibling.firstElementChild;
      }
      else {
        return currentPanel.parentElement.parentElement.lastElementChild.lastElementChild;
      }
    },
    // get current panel element from any element inside tabs element
    getCurrentPanel: function( element ) {
      var tabsHolder = element.closest( '[data-decorator="init-tabs]' );

      return onl.dom.$( '[aria-selected="true"]', tabsHolder )[0];
    },
    switch: function( event ) {
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

  onl.decorate({
    'init-tabs': function( element ) {
      var theseTabs = onl.dom.$( '[role="tab"]', element );
      var panels = onl.dom.$( '[role="tabpanel"]', element );
      var totalPanels = 0;

      // set all selected states
      // fire switchTab function when keys are pressed
      theseTabs.forEach( function( tab ) {
        tab.setAttribute( 'aria-selected', 'false' );
        tab.addEventListener( 'keyup', tabs.switch );
      });

      // hide all panels
      panels.forEach( function( panel ) {
        onl.ui.hide( panel );
      });

      var hash = window.location.hash;
      if ( window.location.hash !== '' ) {
        hash = hash.substr (1, 500 );

        panels.forEach( function( panel ) {
          if ( hash !== '' && hash === panel.getAttribute( 'id' ) ) {
            onl.ui.show( panel );
            theseTabs[totalPanels].setAttribute( 'aria-selected', 'true' );
          }
          totalPanels++;
        });
      } else {
        // show first panel
        onl.ui.show( panels[0] );
        theseTabs[0].setAttribute( 'aria-selected', 'true' );
      }
    }
  });

  onl.handle({
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
