(function () {

  'use strict';

  onl.decorate({
    'init-table': function (element) {
    }
  });

  var tableContainer = function () {
    var allTables = document.getElementsByTagName('table');
    var i;

    for (i = 0; i < allTables.length; i++) {
      if (!allTables[i].parentNode.classList.contains('table__container')) {
        var div = document.createElement('div');
        var container = div.cloneNode(false);

        allTables[i].parentNode.insertBefore(container, allTables[i]);
        container.classList.add('table__container');
        container.appendChild(allTables[i]);

        var windowHeight = window.innerHeight;
        var tableHeight = allTables[i].offsetHeight;
        var tableWidth = allTables[i].offsetWidth;
        var containerWidth = container.offsetWidth;

        // new table height is 80% of the current viewport height
        var newContainerHeight = windowHeight - (windowHeight * 0.2);

        // check if the table is wider than it's container
        if (containerWidth < tableWidth) {
          container.classList.add('has-overflow');
          // check if the table if bigger (in height) than the viewport
          if (tableHeight >= windowHeight) {
            container.style.height = newContainerHeight + 'px';
          }
        }
      }
    }
  }
  var recalculateTableContainerHeight = function () {
    var allFixedTableContainers = document.querySelectorAll('.table__container');
    var i;

    for (i = 0; i < allFixedTableContainers.length; i++) {
      var windowHeight = window.innerHeight;
      var tableWidth = allFixedTableContainers[i].querySelector('table').offsetWidth;
      var containerWidth = allFixedTableContainers[i].offsetWidth;

      // new table height is 80% of the current viewport height
      var newContainerHeight = windowHeight - (windowHeight * 0.2);

      // check if the table is wider than it's container
      if (containerWidth < tableWidth) {
        allFixedTableContainers[i].classList.add('has-overflow');
        allFixedTableContainers[i].style.height = newContainerHeight + 'px';
      } else {
        allFixedTableContainers[i].classList.remove('has-overflow');
        allFixedTableContainers[i].style.height = 'auto';
      }
    }
  }
  tableContainer();

  window.addEventListener('resize', function () {
    if (resizeTimeout) {
      clearTimeout(resizeTimeout);
    }
    var resizeTimeout = window.setTimeout(function () {
      recalculateTableContainerHeight();
    }, 1000);
  });


})();
