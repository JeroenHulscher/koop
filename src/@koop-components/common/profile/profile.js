(function () {

  'use strict';

  var toggle = function( element ) {
    var toggledElement = document.getElementById( element.getAttribute( 'aria-controls' ) );
    var isExpanded = element.getAttribute( 'aria-expanded' ) === 'true';

    if ( isExpanded ) {
      onl.ui.hide( toggledElement );
      element.setAttribute( 'aria-expanded', 'false' );
    } else {
      onl.ui.show( toggledElement );
      element.setAttribute( 'aria-expanded', 'true' );
    }
  };

  onl.decorate({
    'init-profile-toggle': function( element ) {
      var togglerHolder = onl.dom.$( '[data-toggler]', element )[0];
      var toggled = onl.dom.$( '[data-toggled]', element )[0];
      var toggler = document.createElement( 'button' );

      toggler.type = 'button';
      toggler.textContent = 'Opties';
      toggler.setAttribute( 'aria-controls', toggled.id );
      toggler.setAttribute( 'aria-expanded', 'true' ); // this gets set to false when toggle( toggler ) is called
      toggler.setAttribute( 'data-handler', 'toggle-profile-options' );

      togglerHolder.appendChild( toggler );
      toggle( toggler );
    }
  });

  onl.handle({
    'toggle-profile-options': function( element ) {
      toggle(element);
    }
  });

})();