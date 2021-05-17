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
      
      // check if the table__container already excists;
      if (!allTables[i].parentNode.classList.contains('table__container')) {
        
        // add table__container around table;
        var div = document.createElement('div');
        var container = div.cloneNode(false);
        allTables[i].parentNode.insertBefore(container, allTables[i]);
        container.classList.add('table__container');
        container.appendChild(allTables[i]);

        // does the table__container have a scrollbar, caused by the table inside?
        var hasHorizontalScrollbar = container.scrollWidth > container.clientWidth;
        if ( hasHorizontalScrollbar ) {

          // set container state;
          container.classList.add('has-scrollbar');

          // add fullscreen container;
          var divFullscreen = document.createElement('div');
          var containerFullscreen = divFullscreen.cloneNode(false);
          container.parentNode.insertBefore(containerFullscreen, container);
          containerFullscreen.classList.add('table__container__fullscreen');
          
          // create and append open-button BEFORE table__container;
          var linkEnlarge = document.createElement('button');
          linkEnlarge.innerHTML = 'Toon volledige tabel';
          linkEnlarge.setAttribute('data-decorator', 'init-tablefullscreen');
          linkEnlarge.classList.add('table__container__openfullscreen');
          linkEnlarge.classList.add('button');
          linkEnlarge.classList.add('icon-bg');
          linkEnlarge.classList.add('icon--fullscreen');
          containerFullscreen.parentNode.insertBefore(linkEnlarge, containerFullscreen);

          // create close-button
          var linkClose = document.createElement('button');
          linkClose.innerHTML = '<span class="visually-hidden">Sluiten grote weergave tabel</span>';
          linkClose.classList.add('table__container__closefullscreen');
          
          // add table__container close INSIDE fullscreen container;
          containerFullscreen.appendChild(container);
          
          // add link close INSIDE fullscreen container;
          containerFullscreen.appendChild(linkClose);

          

        }
      }
    }
  }
  tableContainer();

})();
