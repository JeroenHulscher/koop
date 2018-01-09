var dom = require( 'helpers/dom' );

function showProfileOptions( element ) {

}

module.exports = function toggleProfileOptions( element ) {
  var togglerHolder = dom.$( '[data-toggler]', element )[0];
  var toggled = dom.$( '[data-toggled]', element )[0];
  var toggler = document.createElement( 'button' );
  var toggleProfileOptions = require( 'common/profile/handlers/toggleProfileOptions' );

  toggler.type = 'button';
  toggler.textContent = 'Opties';
  toggler.setAttribute( 'aria-controls', toggled.id );
  toggler.setAttribute( 'aria-expanded', 'true' ); // this gets set to false when toggleProfileOptions( toggler ) is called
  toggler.setAttribute( 'data-handler', 'toggle-profile-options' );

  togglerHolder.appendChild( toggler );
  toggleProfileOptions( toggler );
};
