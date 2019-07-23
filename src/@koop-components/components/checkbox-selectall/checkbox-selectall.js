(function () {
  'use strict';

  onl.decorate({
    'init-selectall': function (element) {
      new selectall(element);
    }
  });

  var selectall = function (element) {
    this.element = element;
    this.mastercheckbox = this.element.querySelector('.js-checkbox-master');
    this.config = JSON.parse(this.element.getAttribute('data-config')) || [];

    this.mastercheckbox.addEventListener('change', function (e) {
      var i;
      var checkboxes = this.element.querySelectorAll('input[type="checkbox"]');

      for (i = 0; i < checkboxes.length; i++) {
        if (checkboxes[i] !== e.target) {
          checkboxes[i].checked = e.target.checked;

          // onchange event needs manual triggering on checkboxes
          if ("createEvent" in document) {
            var evt = document.createEvent("HTMLEvents");
            evt.initEvent("change", false, true);
            checkboxes[i].dispatchEvent(evt);
          } else {
            checkboxes[i].fireEvent("onchange");
          }
        }

      }
    }.bind(this), false);
  };

})();
