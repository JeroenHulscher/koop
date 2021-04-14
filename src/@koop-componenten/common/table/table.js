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

        var hasHorizontalScrollbar = container.scrollWidth > container.clientWidth;
        if(hasHorizontalScrollbar){
          container.classList.add('has-scrollbar');

          // add fullscreen container;
          var divFullscreen = document.createElement('div');
          var containerFullscreen = divFullscreen.cloneNode(false);
          container.parentNode.insertBefore(containerFullscreen, container);
          containerFullscreen.classList.add('table__container__fullscreen');
          
          

          // add link enlarge;
          var linkEnlarge = document.createElement('button');
          linkEnlarge.innerHTML = 'Vergroot tabel';
          linkEnlarge.setAttribute('data-decorator', 'init-tablefullscreen');
          linkEnlarge.classList.add('table__container__openfullscreen');
          linkEnlarge.classList.add('button');
          linkEnlarge.classList.add('icon-bg');
          linkEnlarge.classList.add('icon--fullscreen');
          // container.parentNode.insertBefore(linkEnlarge, container);
          containerFullscreen.appendChild(linkEnlarge);

          // add link close;
          var linkClose = document.createElement('button');
          linkClose.innerHTML = '<span class="visually-hidden">Sluiten grote weergave tabel</span>';
          linkClose.classList.add('table__container__closefullscreen');
          // container.appendChild(linkClose);
          containerFullscreen.appendChild(container);
          containerFullscreen.appendChild(linkClose);

          

        }
      }
    }
  }
  tableContainer();

})();
