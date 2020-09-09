(function () {
  'use strict';

  onl.decorate({
    'init-video': function (element) {
      new video(element);
    }
  });

  var video = function (element) {
    this.element = element;
    this.config = JSON.parse(this.element.getAttribute('data-config')) || [];
    this.placeholderContainer = this.element.querySelector('.video__placeholder');
    this.trigger = this.element.querySelector('.video__placeholder button');
    this.initEventListeners();
  };

  video.prototype.initEventListeners = function (e) {
    this.trigger.addEventListener('click', function (e) { this.showVideo(e); }.bind(this), false);
  };

  video.prototype.showVideo = function () {
    this.element.classList.add('is-video');
    this.element.setAttribute('role', 'alert');
  };

})();
