// define handlers
//
// handlers are functions that run when a user clicks an interactive
// element with data-handler="function-name"

// handlers are in the folder of the component they relate to. If they relate to
// no component, they are in the general 'handlers' folder (src/assets/js/handlers).

module.exports = {
  'toggle-other-sites': require( 'page-components/header/handlers/toggleOtherSites' ),
  'toggle-nav': require( 'page-components/header/handlers/toggleNav' ),
  'open-tab': require( 'common/tabs/handlers/openTab' )
};

