(function () {

  'use strict';

  onl.decorate({

    'init-kpm': function (element) {
      new kpmService(element, 'push');
    }
  });

  window.kpmLocationModal = function (modalButton, data, modalContentContainer) {
    var location = data[0];
    var infoContainer = document.querySelector(modalContentContainer) || document.querySelector('.js-kpm-location-information');
    var content = '<h2>' +  location.title + '</h2>';
    if ( location.omschrijving ){
      content += '<p>'+ location.omschrijving +'</p>';
    }
    if ( location.url ) {
      content += '<p><a href="' + location.url + '" class="button button--primary">Bekijk publicatie <span class="visually-hidden">"' + location.title + '"</span></p>';
    }

    infoContainer.innerHTML = content;
    modalButton.click();
  }

  var kpmService = function (element, action) {
    this.element = element;
    this.config = JSON.parse(this.element.getAttribute('data-config')) || [];
    this.dataFromJSON = document.querySelector(this.config.config).innerHTML;
    this.rangeSelectors = document.querySelectorAll(this.config.rangeselector);
    this.mapInitialized = false;
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

    if ( action === 'push' && !this.mapInitialized) {
      this.setupMap();
    }

  };

  kpmService.prototype.setRangeListener = function(  ) {
    var y;

    for (y = 0; y < this.rangeSelectors.length; y++) {
      this.rangeSelectors[y].addEventListener('change', function (e) { this.setupMap(e.target, "editRange"); }.bind(this), false);
      if(this.rangeSelectors[y].hasAttribute('checked')) {
        this.setupMap(this.rangeSelectors[y], "editRange");
        this.mapInitialized = true;
      }
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
      var rangeType = e.getAttribute('data-kpm-rangetype');
      var rangeTitle = e.getAttribute('value');
      if (rangeType === "gemeente"){
        this.data.options.center.type = 'location';
        this.data.options.center.location = {};
        this.data.options.center.location.type = rangeType;
        this.data.options.center.location.title = rangeTitle;
      } else {
        if (!isNaN(e.value)) {
          this.data.options.center.circle.radius = parseInt(e.value, 10);
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
    if (typeof window.kaartprikmodule != "undefined") {
    // if (typeof window.kaartprikmodule.bootstrapKpm != "undefined") {
      // window.kaartprikmodule.bootstrapKpm(this.data);
      window.kaartprikmodule.push(['bootstrapKpm', this.data]);
    }
  };

})();
