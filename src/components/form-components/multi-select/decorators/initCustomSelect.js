module.exports = function initCustomSelect( element ) {
  var combobo = require( 'combobo' );
  var options = document.getElementById( element.getAttribute( 'data-multi-select-options' ) );
  var multiSelect = new combobo({
    input: element,

    groups: true,
    activeClass: 'multi-select--active',
    multiSelect: true
  });
};
