module.exports = function toggleSearch( submitButton, event ) {
  var form = submitButton.closest( 'form' );
  var searchTerm = form.querySelector( '.search-form__term' );
  var searchTermHiddenClass = 'search-form__term--hidden';

  event.preventDefault();

  if ( searchTerm.value.length > 0 ) {
    form.submit();
  }
  else {
    if ( searchTerm.classList.contains( searchTermHiddenClass ) ) {
      searchTerm.classList.remove( searchTermHiddenClass );
      searchTerm.focus();
    }
    else {
      searchTerm.classList.add( searchTermHiddenClass );
    }
  }
};
