(function () {

  'use strict';

  onl.decorate({
    'init-table': function( element ) {
    }
  });

  var tableContainer = function (){
    var allTables = document.getElementsByTagName('table');
    var i;

    for (i = 0; i < allTables.length; i++) {
      if (!allTables[i].parentNode.classList.contains('table__container')) {
        var div = document.createElement('div');
        var container = div.cloneNode(false);

        allTables[i].parentNode.insertBefore(container, allTables[i]);
        container.classList.add('table__container');
        container.appendChild(allTables[i]);
      }
    }
  }
  tableContainer();

})();
