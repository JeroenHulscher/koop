// define decorators
//
// decorators are functions that run when the page loads

var decorators = {
  'hide-self': require( 'decorators/hideSelf' ),
  'init-toggle-other-sites': require( 'page-components/header/decorators/initToggleOtherSites' ),
  'init-tabs': require( 'common/tabs/decorators/initTabs' ),
  'init-custom-select': require( 'form-components/multi-select/decorators/initCustomSelect' ),
  'init-profile-toggle': require( 'common/profile/decorators/initProfileToggle' ),
  'init-collapsible': require( 'common/collapsible/decorators/initCollapsible' ),
  'init-search-toggle': require( 'page-components/search/decorators/initSearchToggle' ),
  'add-foldability': require( 'common/treeview/decorators/addFoldability' ),
  'stick-sidebar': require( 'decorators/stickSidebar' ),
  'add-mobile-foldability': require( 'decorators/addMobileFoldability' )
};

module.exports = decorators;

