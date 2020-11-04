(function () {
  'use strict';

  onl.decorate({
    'init-facetgroup': function (element) {
      new facetgroup(element);
    }
  });

  var facetgroup = function (element) {
    this.element = element;
    this.config = JSON.parse(this.element.getAttribute('data-config')) || [];

    this.config.limit = this.config.limit || "5";

    this.list = this.element.querySelector('.js-facetgroup__listholder');
    this.arrayListItems = this.list.querySelectorAll('li');
    this.holder = this.element.querySelector('.holder');

    if (this.holder) {
      this.init();
    }
  };

  facetgroup.prototype.init = function () {

    if (this.arrayListItems > this.config.limit) {
      var clonedList = this.list.cloneNode(true);
      this.holder.appendChild(clonedList);

      var i;
      for (i = 0; i < this.arrayListItems.length; i++) {
        if(i >= this.config.limit){
          this.arrayListItems[i].parentNode.removeChild(this.arrayListItems[i]);
        }
      }
    }

  };

})();
