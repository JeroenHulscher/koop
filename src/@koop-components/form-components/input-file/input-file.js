(function () {

  'use strict';

  onl.decorate({
    'init-inputfile': function (element) {
      new inputfile(element);
    }
  });

  var inputfile = function (element) {
    this.element = element;
    this.config = [];
    // todo: make config extendable on component level.
    this.config.isTouch = onl.ui.isTouch();
    this.config.months = ['januari', 'februari', 'maart', 'april', 'mei', 'juni', 'juli', 'augustus', 'september', 'oktober', 'november', 'december'];

    if (!this.config.isTouch) {
      this.init(element);
    }
  };


  inputfile.prototype.init = function (element) {
      var label = element.querySelector('label');
      console.log('label', label);
      console.log('label', label.innerHTML);
      var labelVal = element.querySelector('input').innerHTML;

      element.addEventListener('change', function (e) {
        var fileName = '';
        if (this.files && this.files.length > 1)
          fileName = (this.getAttribute('data-multiple-caption') || '').replace('{count}', this.files.length);
        else
          fileName = e.target.value.split('\\').pop();

        if (fileName)
          label.querySelector('span').innerHTML = fileName;
        else
          label.innerHTML = labelVal;
      });

    // Firefox bug fix
    element.addEventListener('focus', function () { element.classList.add('has-focus'); });
    element.addEventListener('blur', function () { element.classList.remove('has-focus'); });

  };

})();

