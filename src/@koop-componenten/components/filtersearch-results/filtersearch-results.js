(function () {

  'use strict';

  onl.decorate({

    'init-filter-results': function (element) {
      new filterResults(element);
    }

  });

  var filterResults = function( element ) {
    this.element = element;
    this.config = JSON.parse( this.element.getAttribute( 'data-config' ) ) || [];
    this.init();
  };

  filterResults.prototype.init = function() {
    this.input = onl.dom.$( '.js-filterresults__input', this.element )[0];
    this.results = onl.dom.$( '.js-filterresults__result', this.element );
    this.setContainerClass = '.js-filterresults__resultmother';
    this.btnSelectAll = this.element.querySelector(this.config.btnSelectAll) || this.element.querySelector('.js-filterresults__btn-selectall');
    this.allCheckboxes = this.element.querySelectorAll('input[type="checkbox"], input[type="radio"]');
    this.setContainers = this.element.querySelectorAll(this.setContainerClass);

    this.addEventListeners();
  };

  filterResults.prototype.addEventListeners = function() {
    if (this.btnSelectAll) {
      this.btnSelectAll.addEventListener('click', function() { this.selectAll(event); return false; }.bind(this), false);
    }
    if (this.input) {
      this.input.addEventListener('keyup', function() { this.doFilter(); }.bind(this), false);
    }
  };

  filterResults.prototype.selectAll = function(event) {
    var i;

    for (i = 0; i < this.allCheckboxes.length; i++) {
      // skip this checkbox if it's not visible;
      if (!onl.ui.isVisible(this.allCheckboxes[i])) {
        continue;
      }

      this.allCheckboxes[i].checked = true;
    }

    // onchange event needs manual triggering on checkboxes; only send even once for performance reasons.
    if ("createEvent" in document) {
      var evt = document.createEvent("HTMLEvents");
      evt.initEvent("change", false, true);
      this.allCheckboxes[0].dispatchEvent(evt);
    } else {
      this.allCheckboxes[0].fireEvent("onchange");
    }

    // IE 10 triggers a form-submit, therefor we have to use this statement.
    if (navigator.appVersion.indexOf("MSIE 10") !== -1) {
      event.returnValue = false;
    } else {
      event.preventDefault();
    }
  };

  filterResults.prototype.doFilter = function() {
    var i;
    var y;
    var a;
    var txtValue;
    var filter = this.input.value.toUpperCase();
    var hasVisibleResults = false;
    var setContainers = this.setContainers;
    var amountResults = 0;

    function accentFold(inStr) {
      return inStr.replace(
        /([àáâãāäå])|([çčć])|([èéêë])|([ìíîïī])|([ñń])|([òóôõōöø])|([ß])|([ùúûüū])|([ÿ])|([æ])/g,
        function (str, a, c, e, i, n, o, s, u, y, ae) {
          if (a) return 'a';
          if (c) return 'c';
          if (e) return 'e';
          if (i) return 'i';
          if (n) return 'n';
          if (o) return 'o';
          if (s) return 's';
          if (u) return 'u';
          if (y) return 'y';
          if (ae) return 'ae';
        }
      );
    }

    for (i = 0; i < this.results.length; i++) {
      a = this.results[i];
      txtValue = a.textContent || a.innerText;
      txtValue = txtValue.trim();
      txtValue = txtValue.toLowerCase();

      if (accentFold(txtValue).indexOf(accentFold(filter.toLowerCase())) > -1) {
        this.results[i].removeAttribute('aria-hidden');
        this.results[i].classList.add('is-visible');
        this.results[i].classList.remove('is-invisible');
        amountResults++;
      } else {
        this.results[i].setAttribute('aria-hidden', 'true');
        this.results[i].classList.add('is-invisible');
        this.results[i].classList.remove('is-visible');
      }
    }

    // If a set has no visible options inside, hide the set-container;
    for (y = 0; y < setContainers.length; y++) {
      var results = setContainers[y].querySelectorAll('.is-visible');
      if(results.length < 1) {
        setContainers[y].setAttribute('aria-hidden', 'true');
      } else {
        setContainers[y].removeAttribute('aria-hidden');
      }
    }

    // Check if multi-level and determine if there are results;
    // First scanning for setContainers is quicker than checking all checkboxes;
    if (setContainers.length > 0) {
      for (y = 0; y < setContainers.length; y++) {
        if(!setContainers[y].hasAttribute('aria-hidden')){
          hasVisibleResults = true;
          break;
        }
      }
    } else {
      // no multi-level, determine if there are visible checkboxes;
      for (i = 0; i < this.allCheckboxes.length; i++) {
        // skip this checkbox if it's not visible;
        if (onl.ui.isVisible(this.allCheckboxes[i])) {
          hasVisibleResults = true;
          break;
        }
      }
    }

    var controlsContainerId = '#'+this.input.getAttribute('aria-controls');
    var alertId = '#alert-' + controlsContainerId.substring(1);
    if (!hasVisibleResults) {
      // Check if the alert message already exists;
      if (!this.element.querySelector(alertId)) {
        var message = document.createElement("p");
        message.innerHTML = "Er zijn geen resultaten gevonden";
        message.setAttribute('role', 'alert');
        message.classList.add('alert');
        message.id = alertId.substring(1);
        this.element.querySelector(controlsContainerId).parentNode.appendChild(message);
      }
    } else {
      // There are results, remove alert message;
      if (this.element.querySelector(alertId)){
        this.element.querySelector(alertId).parentNode.removeChild(this.element.querySelector(alertId));
      }
    }

    if (this.btnSelectAll) {
      if (hasVisibleResults) {
        this.btnSelectAll.removeAttribute('aria-hidden');
      } else {
        this.btnSelectAll.setAttribute('aria-hidden', 'true');
      }
      if(this.input.value === '') {
        this.btnSelectAll.innerHTML = this.btnSelectAll.getAttribute('data-label');
      } else {
        if (amountResults === 1) {
          this.btnSelectAll.innerHTML = 'Selecteer ' + amountResults + ' resultaat';
        } else {
          this.btnSelectAll.innerHTML = 'Selecteer ' + amountResults + ' resultaten';
        }
      }
    }
  };

})();
