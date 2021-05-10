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
    this.checkboxes = this.element.querySelectorAll('input[type="checkbox"]:not(.js-checkbox-master)');

    this.amountLabel = this.element.querySelector('.js-amount-checkboxes');
    if(this.amountLabel){
      this.amountLabel.innerHTML = this.checkboxes.length;
    }

    this.init();
  };

  selectall.prototype.init = function (e) {
    // check mastercheckbox if all checkboxes are checked on pageload;
    if(this.areAllCheckboxesChecked()){
      this.mastercheckbox.checked = true;
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
    // this.mastercheckbox.addEventListener('click', function (e) { this.changeMasterCheckbox(e); }.bind(this), false);
    this.mastercheckbox.addEventListener('change', function (e) { this.changeMasterCheckbox(e); }.bind(this), false);
  };

  selectall.prototype.areAllCheckboxesChecked = function (e) {
    if (this.countAmountChecked() === this.checkboxes.length) {
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
    var totalCheckboxes = this.checkboxes.length;
    var stateMasterCheckbox;

    // after un-checking the current checkbox, check the mastercheckbox and if needed uncheck that one as well.
    if (e.target.checked === false && this.mastercheckbox.checked) {
      this.mastercheckbox.checked = false;
      stateMasterCheckbox = false;
    }

    // if all checkboxes are checked, also check the mastercheckbox.
    if (totalCheckboxes === this.countAmountChecked()) {
      this.mastercheckbox.checked = true;
      stateMasterCheckbox = true;
    }

    var insideSubselection = getClosest(this.element, '.subselection');
    if(insideSubselection){
      var checkboxSelectAllOnMain = insideSubselection.querySelector('.js-checkbox-selectAllOnMain');
      if(insideSubselection && checkboxSelectAllOnMain) {
        checkboxSelectAllOnMain.checked = stateMasterCheckbox;
      }
    }
  }

  selectall.prototype.changeMasterCheckbox = function (e) {
    var i;
    var checkboxes = this.checkboxes;
    var stateMasterCheckbox = e.target.checked;

    for (i = 0; i < checkboxes.length; i++) {
      if (checkboxes[i] !== e.target) {

        // skip this checkbox if it's not visible;
        // if(!onl.ui.isVisible(checkboxes[i])) {
        if(checkboxes[i].classList.contains('is-invisible')) {
          continue;
        }

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

    var insideSubselection = getClosest(this.element, '.subselection');
    if(insideSubselection){
      var checkboxSelectAllOnMain = insideSubselection.querySelector('.js-checkbox-selectAllOnMain');
      if(insideSubselection && checkboxSelectAllOnMain) {
        checkboxSelectAllOnMain.checked = stateMasterCheckbox;
      }
    }

  };

})();
