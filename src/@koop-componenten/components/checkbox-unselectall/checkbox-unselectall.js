(function () {
  'use strict';

  onl.decorate({
    'init-unselectall': function (element) {
      new selectall(element);
    }
  });

  var selectall = function (element) {
    this.element = element;
    this.mastercheckbox = this.element.querySelector('.js-checkbox-master');
    this.config = JSON.parse(this.element.getAttribute('data-config')) || [];
    this.checkboxes = this.element.querySelectorAll(this.config.checkboxSelector || 'input[type="checkbox"]:not(.js-checkbox-master)');

    this.init();
  };

  selectall.prototype.init = function (e) {
    // check mastercheckbox if all checkboxes are checked on pageload;
    if(this.areAllCheckboxesNotChecked()){
      // this.mastercheckbox.checked = true;
      this.mastercheckbox.checked = true;
      this.mastercheckbox.setAttribute("checked", "checked");
      this.mastercheckbox.setAttribute("aria-checked", "true");
    }
    this.initEventListeners();
  }

  selectall.prototype.initEventListeners = function (e) {
    var i;

    // regular checkboxes;
    for (i = 0; i < this.checkboxes.length; i++) {
      this.checkboxes[i].addEventListener('click', function (e) { this.changeCheckbox(e); }.bind(this), false);
    }

    // master checkbox (select all)
    this.mastercheckbox.addEventListener('click', function (e) { this.changeMasterCheckbox(e);
    }.bind(this), false);
  };

  selectall.prototype.areAllCheckboxesNotChecked = function (e) {
    if (this.countAmountChecked() === 0) {
      return true;
    }
    return false;
  }
  selectall.prototype.countAmountChecked = function (e) {
    var y;
    var amountChecked = 0;

    // count amount of checked checkboxes
    for (y = 0; y < this.checkboxes.length; y++) {
      if (this.checkboxes[y].checked) {
        amountChecked++;
      }
    }
    return amountChecked;
  }

  selectall.prototype.changeCheckbox = function (e) {
    if (e.target.checked === true && this.mastercheckbox.checked) {
      // this.mastercheckbox.checked = false;
      this.mastercheckbox.checked = false;
      this.mastercheckbox.removeAttribute("checked");
      this.mastercheckbox.setAttribute("aria-checked", "false");
    }

    // if no checkbox is checked, check the master;
    if (this.countAmountChecked() === 0) {
      // this.mastercheckbox.checked = true;
      this.mastercheckbox.checked = true;
      this.mastercheckbox.setAttribute("checked", "checked");
      this.mastercheckbox.setAttribute("aria-checked", "true");
    }
  }

  selectall.prototype.changeMasterCheckbox = function (e) {
    var i;
    var checkboxes = this.checkboxes;

    if(e.target.checked) {
      e.target.checked = true;
    } else {
      e.target.checked = true;
    }

    for (i = 0; i < checkboxes.length; i++) {
      if (checkboxes[i] !== e.target) {
        if (checkboxes[i].checked) {
          checkboxes[i].checked = false;

          // onchange event needs manual triggering on checkboxes
          if ("createEvent" in document) {
            var evt = document.createEvent("HTMLEvents");
            evt.initEvent("change", false, true);
            checkboxes[i].dispatchEvent(evt);
          } else {
            var evtObj = document.createEventObject();
            checkboxes[i].fireEvent("change", evtObj);
          }
        }
      }
    }
  };

})();
