// define handlers
//
// handlers are functions that run when a user clicks an interactive
// element with data-handler="function-name"

// handlers are in the folder of the component they relate to. If they relate to
// no component, they are in the general 'handlers' folder (src/assets/js/handlers).

module.exports = {
  'toggle-other-sites': require( 'page-components/header/handlers/toggleOtherSites' ),
  'toggle-nav': require( 'page-components/header/handlers/toggleNav' ),
  'toggle-collapsible': require( 'common/collapsible/handlers/toggleCollapsible' ),
  'open-previous-panel': require( 'common/tabs/handlers/openPrevPanel' ),
  'open-next-panel': require( 'common/tabs/handlers/openNextPanel' ),
  'open-panel': require( 'common/tabs/handlers/openPanel' ),
  'open-modal': require( 'common/modal/handlers/openModal' ),
  'close-modal': require( 'common/modal/handlers/closeModal' ),
  'toggle-profile-options': require( 'common/profile/handlers/toggleProfileOptions' ),
  'toggle-fold': require( 'common/treeview/handlers/toggleFold' ),
  'toggle-explanation': require( 'form-components/question-explanation/toggleExplanation' ),
  'close-explanation': require( 'form-components/question-explanation/closeExplanation' ),
  'remove-element': require( 'handlers/removeElement' ),
  'toggle-search': require( 'page-components/search/handlers/toggleSearch' )
};

