onl.handle({
  /**
   * Close an alert that is fixed to the top of the screen.
   * @param element 
   * @param event 
   */
  'close-alert': function(element, event) {
    event.preventDefault();

    var alerts = findAncestorWithClass(element, 'alert');

    // Prevention of classList.replace as IE9 does not support it.
    alerts.classList.remove('show');
    alerts.classList.add('hide');

    setTimeout(function() {
      alerts.classList.remove('hide');
    }, 500);
  }
});

/**
 * Finds and returns the first ancestor with a given class.
 * @param el element to start looking from
 * @param className class name to look for
 */
function findAncestorWithClass(el, className) {
  while((el = el.parentElement) && !el.classList.contains(className));
  return el;
}
