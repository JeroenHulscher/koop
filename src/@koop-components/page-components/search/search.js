(function () {

  'use strict';

  var searchToggle = {
    'context': {
      'searchTermHiddenClass' : 'search__term--hidden',
      'searchTermAnimateClass' : 'search__term--animating',
      'open' : 'Open zoekveld',
      'close' : 'Sluit zoekveld',
      'submit' : 'Zoek'
    },
    'handleInputChange': function( event ) {
      var input = event.target;
      var button = input.form.querySelector( 'button' );

      if ( input.value.length > 0 ) {
        button.textContent = searchToggle.context.submit;
      }
      else {
        button.textContent = searchToggle.context.close;
      }
    }
  };

  onl.handle({
    'toggle-search': function toggleSearch( submitButton, event ) {
      var form = submitButton.closest( 'form' );
      var searchTerm = form.querySelector( '.search__term' );
      var searchButton = form.querySelector( 'button' );
      var searchTermHiddenClass = searchToggle.context.searchTermHiddenClass;

      event.preventDefault();

      if ( searchTerm.value.length > 0 ) {
        form.submit();
      }
      else {
        if ( searchTerm.classList.contains( searchTermHiddenClass ) ) {
      // open
      searchTerm.classList.remove( searchTermHiddenClass );
      searchTerm.focus();
      searchButton.textContent = searchToggle.context.close;
    }
    else {
      // close
      searchTerm.classList.add( searchTermHiddenClass );
      searchButton.textContent = searchToggle.context.open;
      searchTerm.value = ''; // reset so we don't submit while term is hidden
    }
  }
}
});


  onl.decorate({
    'init-search-toggle': function(element) {
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
    }
  });


})();