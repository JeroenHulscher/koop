module.exports = function initSearchToggle( element ) {
  var searchToggle = require( 'page-components/search/searchToggle' );
  var searchTerm = element.querySelector( '.search__term' );
  var searchButton = element.querySelector( 'button' );

  var searchTermHiddenClass = searchToggle.context.searchTermHiddenClass;
  var searchTermAnimateClass = searchToggle.context.searchTermAnimateClass;

  searchTerm.classList.add( searchTermHiddenClass );
  searchTerm.addEventListener( 'keyup', searchToggle.handleInputChange );
  searchButton.textContent = searchToggle.context.open;
  searchButton.setAttribute( 'data-handler', 'toggle-search' );

  setTimeout( function(){
    searchTerm.classList.add( searchTermAnimateClass );
  }, 500 );
};
