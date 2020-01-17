(function () {

  'use strict';

  onl.decorate({

    'init-kpm': function (element) {
      new kpmService(element, 'push');
    }
  });

  var kpmService = function (element, action) {
    this.element = element;
    this.config = JSON.parse(this.element.getAttribute('data-config')) || [];
    this.dataFromJSON = document.querySelector(this.config.config).innerHTML;
    this.inputRange = document.getElementsByName('kpm-straal');

    if (this.inputRange) {
      this.setRangeListener();
    }

    if ( action === 'push') {
      this.setupMap();
    }
  };

  kpmService.prototype.setRangeListener = function(  ) {
    var y;

    for (y = 0; y < this.inputRange.length; y++) {
      this.inputRange[y].addEventListener('change', function (e) { this.setupMap(e, "editRange"); }.bind(this), false);
    }
  };

  kpmService.prototype.setupMap = function(e, action ) {

    window.kaartprikmodule = window.kaartprikmodule || [];

    // create default object;
    this.data = {
      debug: true,
      on_cancel: function () {
        console.log("The user has closed the map without saving");
      },
      on_submit: function (result) {
        console.log("The following result was returned:", result);
      }
    };
    this.data.mount_element = document.getElementById(this.element.getAttribute('id'));;

    // extend object with component config;
    Object.assign(this.data, JSON.parse(this.dataFromJSON));

    if(action === "editRange") {
      var parent = getClosest(this.element, '.map');

      if (e.target.value === "hideMap"){
        parent.setAttribute('hidden','hidden');
      } else {
        this.data.options.center.circle.radius = parseInt(e.target.value, 10);
        parent.removeAttribute('hidden');
      }
    }

    // start KPM;
    this.renderMap();

  };

  kpmService.prototype.renderMap = function () {
    kaartprikmodule.bootstrapKpm(this.data);
  };

})();
