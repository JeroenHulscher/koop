(function () {
  'use strict';

  onl.decorate({
    'init-videoplayer': function (element) {
      new videoplayer(element);
    }
  });

  var videoplayer = function (element) {
    this.element = element;
    this.config = JSON.parse(this.element.getAttribute('data-config')) || [];
    this.initiateVideo();
  };

  videoplayer.prototype.initiateVideo = function () {
    new Plyr(this.element);
  };

})();
