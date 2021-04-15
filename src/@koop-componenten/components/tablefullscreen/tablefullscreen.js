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
    
    this.openButton = this.element;
    this.closeButton = this.element.nextSibling.querySelector('.table__container__closefullscreen');
    this.tableFullscreenContainer = this.element.nextSibling;
    this.previouslyFocused = this.openButton;
    
    this.element.addEventListener('click', function (e) {
      self.openFullscreenMode();
      e.preventDefault();
    }.bind(this), false);

    this.closeButton.addEventListener('click', function (e) {
      self.closeFullscreenMode();
      e.preventDefault();
    }.bind(this), false);
  };

  tablefullscreen.prototype.openFullscreenMode = function () {

    // set element state;
    this.element.nextSibling.classList.add('is-fullscreen');

    // set attributes;
    this.element.nextSibling.setAttribute('aria-modal', true);
    this.element.nextSibling.setAttribute('role', 'dialog');
    
    // set body state;
    document.body.classList.add('is-modal-open');

    // set table height in modal;
    var table = this.element.nextSibling.querySelector('.table__container');
    var windowHeight = window.innerHeight;
    table.style.height = windowHeight - 145 + "px";

    // set and trap focus;
    onl.ui.focus( this.tableFullscreenContainer );
    onl.ui.bindFocusTrap( this.tableFullscreenContainer );
  };
  tablefullscreen.prototype.closeFullscreenMode = function () {
    // remove element state;
    this.element.nextSibling.classList.remove('is-fullscreen');
    
    // remove body state;
    document.body.classList.remove('is-modal-open');

    // remove attributes;
    this.element.nextSibling.removeAttribute('aria-modal', true);
    this.element.nextSibling.removeAttribute('role', 'dialog');

    // reset table height;
    var table = this.element.nextSibling.querySelector('.table__container');
    table.style.height = "auto";

    // undo focus and set focus on previously focussed element;
    onl.ui.unbindFocusTrap( this.tableFullscreenContainer );
    if ( this.previouslyFocused ) {
      onl.ui.focus( this.previouslyFocused );
    }
  };

})();
