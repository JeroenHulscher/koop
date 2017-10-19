var searchToggle = {
  'context': {
    'searchTermHiddenClass' : 'search-form__term--hidden',
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

module.exports = searchToggle;
