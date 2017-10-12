// define decorators
//
// decorators are functions that run when the page loads

var decorators = {
  'init-toggle-other-sites': require( 'page-components/header/decorators/initToggleOtherSites' ),
  'init-tabs': require( 'common/tabs/decorators/initTabs' ),
  'init-custom-select': require( 'form-components/multi-select/decorators/initCustomSelect' )
};

module.exports = decorators;

