onl.handle({
  /**
   * Empty input text if the remove text button is clicked.
   * @param element
   * @param event
   */
  'empty-input': function(element, event) {

    event.preventDefault();
    element.previousElementSibling.value = '';
    element.classList.add('invisible');
    element.previousElementSibling.focus();

    // trigger keyUp event on input (for ie. filtersearch-results component)
    if ("createEvent" in document) {
      var evt = document.createEvent("HTMLEvents");
      evt.initEvent("keyup", false, true);
      element.previousElementSibling.dispatchEvent(evt);
    } else {
      element.previousElementSibling.fireEvent("keyup");
    }

  }
});

onl.decorate({
  /**
   * Toggle visibility of the remove button based on text input.
   * @param element
   * @param event
   */
  'toggle-remove-visibility': function(element, event) {
    var removeButton = element.nextElementSibling;

    element.addEventListener('keyup', function(e) {

      // Check if remove button is currently invisible and there is text.
      if(removeButton.classList.contains('invisible') && element.value.length > 0) {
        // If button is invisible and input contains text, make button visible.
        removeButton.classList.remove('invisible');
      } else if(!removeButton.classList.contains('invisible') && element.value.length > 0) {
        // If button is invisible and input contains text, make button visible.
        removeButton.classList.remove('invisible');
      } else if(!removeButton.classList.contains('invisible') && element.value.length === 0) {
        // If button is visible and input does not contain text, make button invisible.
        removeButton.classList.add('invisible');
      }

    }, false);
  }
});
