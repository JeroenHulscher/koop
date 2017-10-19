module.exports = function initSearchToggle( element ) {
  var searchTerm = element.querySelector( '.search-form__term' );
  var searchTermHiddenClass = 'search-form__term--hidden';

  searchTerm.classList.add( searchTermHiddenClass );
};
