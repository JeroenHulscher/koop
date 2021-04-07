(function () {
  'use strict';

  onl.decorate({
    'init-tablefullscreen': function (element) {
      new tablefullscreen(element);
    }
  });

  var tablefullscreen = function (element) {
    var self = this;
    this.element = element;
    this.config = JSON.parse(this.element.getAttribute('data-config')) || [];
    
    var closeButton = this.element.parentNode.querySelector('.table__container__closefullscreen');
    var tableFullscreenContainer = this.element.parentNode;
    
    this.element.addEventListener('click', function (e) {
      self.openFullscreenMode();
      e.preventDefault();
    }.bind(this), false);

    closeButton.addEventListener('click', function (e) {
      self.closeFullscreenMode();
      e.preventDefault();
    }.bind(this), false);
  };

  tablefullscreen.prototype.openFullscreenMode = function () {
    this.element.parentNode.classList.add('is-fullscreen');
    document.body.classList.add('is-modal-open');
    var table = this.element.parentNode.querySelector('.table__container');
    var windowHeight = window.innerHeight;
    table.style.height = windowHeight - 165 + "px";
    // onl.ui.focus( modal );
    // onl.ui.bindFocusTrap( modal );
  };
  tablefullscreen.prototype.closeFullscreenMode = function () {
    this.element.parentNode.classList.remove('is-fullscreen');
    document.body.classList.remove('is-modal-open');
    var table = this.element.parentNode.querySelector('.table__container');
    table.style.height = "auto";
  };

})();
