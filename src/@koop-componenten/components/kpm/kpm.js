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
    this.rangeSelectors = document.querySelectorAll(this.config.rangeselector);
    var self = this;
    var isModalVisible = true;
    this.id = this.element.getAttribute('id');

    var insideModal = getClosest(this.element, '.modal');
    if (insideModal) {
      isModalVisible = isVisible(insideModal);
    }

    if (!isModalVisible) {
      var subscription = pubsub.subscribe('/modal/open', function (obj) {
        var kpmMap = obj.modal.querySelector('.map__kpm');
        if (!kpmMap) { return; }
        if (self.id === kpmMap.getAttribute('id')) {
          self.setupMap();
        }
      });
      return;
    }

    if (this.rangeSelectors) {
      this.setRangeListener();
    }

    if ( action === 'push') {
      this.setupMap();
    }
  };

  kpmService.prototype.setRangeListener = function(  ) {
    var y;

    for (y = 0; y < this.rangeSelectors.length; y++) {
      this.rangeSelectors[y].addEventListener('change', function (e) { this.setupMap(e, "editRange"); }.bind(this), false);
    }
  };

  kpmService.prototype.setupMap = function(e, action ) {

    window.kaartprikmodule = window.kaartprikmodule || [];

    // create default object;
    this.data = {
      debug: false,
      on_cancel: function () {
        // console.log("The user has closed the map without saving");
      },
      on_submit: function (result) {
        // console.log("The following result was returned:", result);
      }
    };
    this.data.mount_element = document.getElementById(this.element.getAttribute('id'));


    // extend object with component config;
    Object.assign(this.data, JSON.parse(this.dataFromJSON));

    if(action === "editRange") {
      if (e.target.getAttribute('data-kpm-rangetype') === "city"){
        this.element.setAttribute('hidden','hidden');
      } else {
        this.data.options.center.circle.radius = parseInt(e.target.value, 10);
        this.element.removeAttribute('hidden');
      }

    }

    // start KPM;
    this.renderMap();

  };

  kpmService.prototype.renderMap = function () {
    kaartprikmodule.bootstrapKpm(this.data);
  };

})();
