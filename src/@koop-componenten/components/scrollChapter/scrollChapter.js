(function () {
  'use strict';

  onl.decorate({
    'init-scroll-chapter': function (element) {
      new scrollChapter(element);
    }
  });

  var scrollChapter = function (element) {
    this.element = element;
    this.config = JSON.parse(this.element.getAttribute('data-config')) || [];

    this.chapterLinks = this.config.chapterLinks || document.querySelectorAll('.nav-sub a');
    // this.chapters = this.config.chapters || document.querySelectorAll('.js-scrollSection');
    this.lastId;
    this.cur = [];

    this.initEventListeners();

  };

  scrollChapter.prototype.initEventListeners = function() {
    var y;

    for (y = 0; y < this.chapterLinks.length; y++) {
      this.chapterLinks[y].addEventListener('click', function (e) { this.chapterLinksClickhandler(e); }.bind(this), false);
    }

    window.addEventListener('scroll', function(e) {
      var self = this;
      var timer;

      if (timer) {
        window.clearTimeout(timer);
      }

      timer = window.setTimeout(function() {
        self.onScroll(e);
      }, 10);
     }.bind(this), false);

  };

  scrollChapter.prototype.chapterLinksClickhandler = function(el){
    var target;
    var targetHash = el.target.hash;

    // check if the hash destination is linked to an accordion item, if so; open the accordion item.
    if(targetHash != "") {
      target = document.getElementById(targetHash.substring(1));
      if(target.getAttribute('class') === 'accordion__item') {
        var trigger = target.querySelector('.accordion__item__header-trigger');
        if(trigger) {
          if(trigger.getAttribute('aria-expanded') === 'false') {
            trigger.click();
          }
        }
      }
    }
  }

  scrollChapter.prototype.offset = function(el){
    var rect = el.getBoundingClientRect(),
      scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
      scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    return { top: rect.top + scrollTop, left: rect.left + scrollLeft }
  }

  scrollChapter.prototype.onScroll = function() {
    var section;
    var fromTop = window.pageYOffset + 2;
    var offset;
    var i;
    var link;

    for (i = 0; i < this.chapterLinks.length; i++) {
      link = this.chapterLinks[i];
      if (link.hash !== '') {
        section = document.querySelector(link.hash);
        if(section){
          offset = this.offset(section);
          if (
            offset.top <= fromTop &&
            offset.top + section.offsetHeight > fromTop
          ) {
            link.classList.add('is-currentchapter');
          } else {
            link.classList.remove('is-currentchapter');
          }
        }
      }
    }

  };

})();


// This should probably be throttled.
// Especially because it triggers during smooth scrolling.
// https://lodash.com/docs/4.17.10#throttle
// You could do like...
// window.addEventListener("scroll", () => {
//    _.throttle(doThatStuff, 100);
// });
// Only not doing it here to keep this Pen dependency-free.


