(function() {
  'use strict';

  onl.decorate({
    /**
     * Applies a 'collapsed' class to the element to collapse after clicking on the trigger.
     * @param element 
     * @param event 
     */
    'handle-collapse': function(element, event) {
      var trigger = element.querySelector('.trigger-collapse');

      trigger.addEventListener('click', function(e) {
        e.preventDefault();

        if(element.classList.contains('collapsed')) {
          element.classList.remove('collapsed');
        } else {
          element.classList.add('collapsed');
        }
      });
    }
  });
})();
