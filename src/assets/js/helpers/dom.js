var ui = require( 'helpers/ui' );

var dom = {
  // convenience function that returns an Array of elements that matches selectors
  $: function( selectors, baseElement ) {
    var elements = ( baseElement || document ).querySelectorAll( selectors );

    return Array.prototype.slice.call( elements );
  },
  // find a DOM element based on a href
  getElementFromHref: function( href ) {
    var id = href.match( /#(.+)/ )[1];

    return document.getElementById( id );
  },
  // return an array of existing elements from an array of ids.
  getExistingElementsByIds: function( ids ) {
    return ids
      .map( function( id ) {
        return document.getElementById( id );
      })
      .filter( function( element ) {
        // only return existing elements
        return element;
      });
  },
  // check if an element can natively be disabled
  isDisableable: function( element ) {
    return Object.getPrototypeOf( element ).hasOwnProperty( 'disabled' );
  },
  // find out if an element is visible, uses ui#isHidden
  isVisibleElement: function( element ) {
    var CHECK_FOR_HIDDEN_PARENTS = true;

    // only return elements that are not hidden and not inside a hidden parent
    return !ui.isHidden( element, CHECK_FOR_HIDDEN_PARENTS );
  },
  // get all *visible* elements that have a required or data-custom-required attribute
  getRequiredElements: function( element ) {
    return dom.$( '[required]', element )
      .filter( dom.isVisibleElement );
  },
  // return either the custom required element or the actual required element
  getRequiredElement: function( element ) {
    return element.querySelector( element.querySelector( '[required]' ) );
  }
};

module.exports = dom;
