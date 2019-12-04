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
    this.checkboxes = this.element.querySelectorAll('input[type="checkbox"]');

    this.initEventListeners();
  };

  selectall.prototype.initEventListeners = function (e) {
    var i;

    // master checkbox (select all)
    this.mastercheckbox.addEventListener('change', function (e) {
      var i;
      var checkboxes = this.checkboxes;

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

    // uncheck the 'select all'-checkbox when any of the checkboxes is not checked anymore;
    for (i = 0; i < this.checkboxes.length; i++) {
      this.checkboxes[i].addEventListener('change', function (e) {
        if (!e.target.classList.contains('js-checkbox-master')) {
          this.regularCheckboxListener(e);
        }
      }.bind(this), false);
    }

  };

  selectall.prototype.regularCheckboxListener = function (e) {
    var checkbox = e.target;

    if (checkbox.checked === false && this.mastercheckbox.checked) {
      this.mastercheckbox.checked = false;
    }

  };

})();
