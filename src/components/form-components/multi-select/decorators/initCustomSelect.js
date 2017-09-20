

module.exports = function initCustomSelect( element ) {
  var combobo = require( 'combobo' );
  var options = document.getElementById( element.getAttribute( 'data-multi-select-options' ) );
  var multiSelect = new combobo({
    input: '#' + element.id,
    list: '#' + element.getAttribute( 'data-multi-select-options' ),
    groups: '.multi-select__optgroup',
    openClass: 'multi-select__options--open',
    options: '.multi-select__optgroup-option',
    activeClass: 'multi-select__optgroup-option--active',
    selectedClass: 'multi-select__optgroup-option--selected',
    selectionValue: function( selection ) {
      return selection.map( function( selectedItem ) {
        return selectedItem.textContent;
      }).join(', ')
    },
    multiselect: true,
    noResultsText: 'Geen resultaten gevonden'
});
};
