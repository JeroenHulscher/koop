module.exports = function initSearchToggle( element ) {
  var searchToggle = require( 'common/search/searchToggle' );
  var searchTerm = element.querySelector( '.search__term' );
  var searchButton = element.querySelector( 'button' );

  var searchTermHiddenClass = searchToggle.context.searchTermHiddenClass;

  searchTerm.classList.add( searchTermHiddenClass );
  searchTerm.addEventListener( 'keyup', searchToggle.handleInputChange );
  searchButton.textContent = searchToggle.context.open;
  searchButton.setAttribute( 'data-handler', 'toggle-search' );
};
