/**
 * Empty input text if the remove text button is clicked.
 * @param element
 * @param event
 */
onl.handle({
  'empty-input': function(element, event) {
    element.previousElementSibling.value = '';
  }
});
