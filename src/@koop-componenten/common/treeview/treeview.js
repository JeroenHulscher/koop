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
    }
  });

})();
