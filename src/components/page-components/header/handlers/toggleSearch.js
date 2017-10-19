module.exports = function toggleSearch( submitButton, event ) {
  var searchToggle = require( 'page-components/header/searchToggle' );
  var form = submitButton.closest( 'form' );
  var searchTerm = form.querySelector( '.search-form__term' );
  var searchButton = form.querySelector( 'button' );
  var searchTermHiddenClass = searchToggle.context.searchTermHiddenClass;

  event.preventDefault();

  if ( searchTerm.value.length > 0 ) {
    form.submit();
  }
  else {
    if ( searchTerm.classList.contains( searchTermHiddenClass ) ) {
      searchTerm.classList.remove( searchTermHiddenClass );
      searchTerm.focus();
      searchButton.textContent = searchToggle.context.close;
    }
    else {
      searchTerm.classList.add( searchTermHiddenClass );
      searchButton.textContent = searchToggle.context.open;
    }
  }
};
