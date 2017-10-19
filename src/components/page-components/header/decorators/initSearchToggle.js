module.exports = function initSearchToggle( element ) {
  var searchToggle = require( 'page-components/header/searchToggle' );
  var searchTerm = element.querySelector( '.search-form__term' );
  var searchButton = element.querySelector( 'button' );

  var searchTermHiddenClass = searchToggle.context.searchTermHiddenClass;

  searchTerm.classList.add( searchTermHiddenClass );
  searchButton.textContent = searchToggle.context.open;
};
