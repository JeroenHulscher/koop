(function () {

  'use strict';

  onl.decorate({

    'init-kpm': function (element) {
      new kpmService(element, 'push');
    }
  });

  var kpmService = function (element, action) {
    // console.log('kpmService');
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
        // console.log('subscribe received: /modal/modal');
        var kpmMap = obj.modal.querySelector('.map__kpm');
        if (!kpmMap) { console.log('geen kpmMap'); return; }
        // console.log('id', self.id, kpmMap.getAttribute('id'));
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
    // this.data.mount_element = document.getElementById(this.element.getAttribute('id'));
    this.data.mount_element = '#' + this.element.getAttribute('id');


    // extend object with component config;
    Object.assign(this.data, JSON.parse(this.dataFromJSON));

    if(action === "editRange") {
      var rangeType = e.target.getAttribute('data-kpm-rangetype');
      var rangeTitle = e.target.getAttribute('value');
      if (rangeType === "gemeente"){
        this.data.options.center.type = 'location';
        this.data.options.center.location = {};
        this.data.options.center.location.type = rangeType;
        this.data.options.center.location.title = rangeTitle;
      } else {
        if (!isNaN(e.target.value)) {
          this.data.options.center.circle.radius = parseInt(e.target.value, 10);
        } else {
          // not a valid number; do nothing.
          return false;
        }
      }

    }

    // start KPM;
    this.renderMap();

  };

  kpmService.prototype.renderMap = function () {
    // console.log('this.data', this.data);
    // console.log('this.data.mount_element', this.data.mount_element);
    if (typeof window.kaartprikmodule != "undefined") {
    // if (typeof window.kaartprikmodule.bootstrapKpm != "undefined") {
      // window.kaartprikmodule.bootstrapKpm(this.data);
      window.kaartprikmodule.push(['bootstrapKpm', this.data]);
    }
  };


})();

var kpmService2 = function (action, data) {

  this.data = data;
  console.log('kpmService2', this.data);
  console.log('kpmService2 action?', action);
  if (action === 'push') {
    this.push(data);
  }
};

kpmService2.prototype.push = function (data) {
  window.kaartprikmodule = window.kaartprikmodule || [];
  window.kaartprikmodule.push(['bootstrapKpm', data]);
  console.log('pussssht', data);
};

new kpmService2();

