// define decorators
//
// decorators are functions that run when the page loads

var decorators = {
  'init-toggle-other-sites': require( 'page-components/header/decorators/initToggleOtherSites' ),
  'init-tabs': require( 'common/tabs/decorators/initTabs' )
};

module.exports = decorators;

