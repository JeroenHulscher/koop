( function() {

  'use strict';

  var openText = 'Toon onderliggende';
  var closeText = 'Verberg onderliggende';

  var treeview = {
    getFoldableChildren: function( element ) {
      // note: element is <a> element that contains button ;
      // this returns an array of all the elements except the
      return Array.prototype.slice.call( element.parentNode.children, 1 );
    },
    getFoldableChildrenIDRef: function( foldableChildren ) {
      var string = '';
      var i;

      for ( i = 0; i < foldableChildren.length; i++ ) {
        if ( i > 0 ) {
          string += ' ' + foldableChildren[i].id;
        }
        else {
          string += foldableChildren[i].id;
        }
      }

      return string;
    }
  };

  onl.handle({
    'toggle-fold': function( element, event ) {

      var containingLink = element.parentNode;
      var subLists = treeview.getFoldableChildren( containingLink );

      event.preventDefault();

      subLists.forEach( function( toggleable ) {
        if ( onl.ui.isHidden( toggleable ) ) {
          onl.ui.show( toggleable );
          element.textContent = closeText;
          element.setAttribute( 'aria-expanded', 'true' );
        }
        else {
          onl.ui.hide( toggleable );
          element.textContent = openText;
          element.setAttribute( 'aria-expanded', 'false' );
        }
      });
    }
  });

  onl.decorate({
    'add-foldability': function( element ) {

      var foldableChildren = treeview.getFoldableChildren( element );
      var foldableChildrenIDRef = treeview.getFoldableChildrenIDRef( foldableChildren );
      var needsFoldability = foldableChildren.length > 0;
      var toggleButton;

      if ( needsFoldability ) {
        toggleButton = document.createElement( 'button' );
        toggleButton.type = 'button';
        toggleButton.textContent = closeText;
        toggleButton.setAttribute( 'data-handler', 'toggle-fold' );
        toggleButton.setAttribute( 'aria-expanded', 'false' );

        if ( foldableChildrenIDRef ) {
          toggleButton.setAttribute( 'aria-controls', foldableChildrenIDRef );
        }

        element.appendChild( toggleButton );
      }
    },
    'init-legacytreeview': function ( element ) {
      // used in collection: (RPS) OEB
      new legacyTreeview(element);
    }
  });

  var legacyTreeview = function (element) {
    this.element = element;
    this.init();
  }

  legacyTreeview.prototype.init = function () {
    var i;
    this.foldouts = this.element.querySelectorAll('.nav .first .toc');

    for (i = 0; i < this.foldouts.length; i++) {

      var randomId = '_' + Math.random().toString(36).substr(2, 9);
      console.log('randomId', randomId);
      var elementWithChildren = this.foldouts[i].parentNode.querySelector('a:first-child');
      var toggleButton = document.createElement('button');

      this.foldouts[i].setAttribute('hidden', true);
      this.foldouts[i].setAttribute('id', randomId);

      toggleButton.type = 'button';
      toggleButton.textContent = openText;
      toggleButton.setAttribute('data-handler', 'toggle-fold');
      toggleButton.setAttribute('aria-expanded', 'false');
      toggleButton.setAttribute('aria-controls', randomId);

      elementWithChildren.appendChild(toggleButton);

    }

    if (this.foldouts) {
      this.element.querySelector('.nav.nav-tree').classList.add('treeview--foldable');
    }

  }

})();
