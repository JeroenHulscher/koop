

(function () {

  'use strict';

  onl.decorate({
    'init-multiselect': function (element) {
      new multiselect(element);
    }
  });

  var multiselect = function (element) {
    this.element = element;
    this.config = [];

    this.config.placeholder = this.element.getAttribute( 'data-decorator-placeholder' );
    this.config.searchPlaceholder = 'Search options';
    this.config.noResultsText = 'No results';
    this.config.userOptionPrefix = 'Add ';

    this.init();
  };


  multiselect.prototype.init = function (element) {
    $('.multipleSelect').fastselect({
      placeholder: this.config.placeholder,
      searchPlaceholder: this.config.searchPlaceholder,
      noResultsText: this.config.noResultsText,
      userOptionPrefix: this.config.userOptionPrefix
    });
    $('.multipleSelect').on('blur', function() {
      console.log('12');
      $(this).parents('.fstElement').removeClass('fstResultsOpened');
      $(this).parents('.fstElement').removeClass('fstActive');
    });

  };

})();
