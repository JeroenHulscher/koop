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
    
    this.openButton = this.element.parentNode.querySelector('.table__container__openfullscreen');
    this.closeButton = this.element.parentNode.querySelector('.table__container__closefullscreen');
    this.tableFullscreenContainer = this.element.parentNode;
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
    this.element.parentNode.classList.add('is-fullscreen');
    document.body.classList.add('is-modal-open');
    var table = this.element.parentNode.querySelector('.table__container');
    var windowHeight = window.innerHeight;
    table.style.height = windowHeight - 145 + "px";

    onl.ui.focus( this.tableFullscreenContainer );
    onl.ui.bindFocusTrap( this.tableFullscreenContainer );

    this.openButton.setAttribute('tabindex', -1);
  };
  tablefullscreen.prototype.closeFullscreenMode = function () {
    this.element.parentNode.classList.remove('is-fullscreen');
    document.body.classList.remove('is-modal-open');
    var table = this.element.parentNode.querySelector('.table__container');
    table.style.height = "auto";

    this.openButton.setAttribute('tabindex', 0);
    onl.ui.unbindFocusTrap( this.tableFullscreenContainer );
    console.log('this.previouslyFocused',this.previouslyFocused);
    if ( this.previouslyFocused ) {
      onl.ui.focus( this.previouslyFocused );
    }

    
  };

})();
