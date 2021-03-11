

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
    this.config.searchPlaceholder = 'Zoek opties';
    this.config.noResultsText = 'Geen resultaten';
    this.config.userOptionPrefix = 'Toevoegen ';

    this.init();
  };


  multiselect.prototype.init = function() {
    $( this.element ).fastselect({
      placeholder: this.config.placeholder,
      searchPlaceholder: this.config.searchPlaceholder,
      noResultsText: this.config.noResultsText,
      userOptionPrefix: this.config.userOptionPrefix,
      clearQueryOnSelect: true,

      elementClass: 'multiselect__container',
      singleModeClass: 'multiselect--singlemode',
      noneSelectedClass: 'has-noneSelected',
      multipleModeClass: 'multiselect--multiplemode',
      queryInputClass: 'multiselect__input',
      inputHelptextClass: 'multiselect__helptext',
      queryInputExpandedClass: 'is-expanded',
      fakeInputClass: 'multiselect__fakeinput',
      controlsClass: 'multiselect__controls',
      toggleButtonClass: 'multiselect__togglebutton',
      activeClass: 'is-active',
      itemSelectedClass: 'is-selected',
      choiceItemClass: 'multiselect__choice',
      choiceRemoveClass: 'multiselect__choiceremove',

      resultsContClass: 'multiselect__resultscontainer',
      resultsOpenedClass: 'is-open',
      resultsFlippedClass: 'is-flipped',
      groupClass: 'multiselect__group',
      groupTitleClass: 'multiselect__group-title',
      itemClass: 'multiselect__result',
      loadingClass: 'is-loading',
      noResultsClass: 'has-noresults',
      focusedItemClass: 'has-focus'
    });
  };

})();
