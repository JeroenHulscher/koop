module.exports = {

  'getFoldableChildren' : function( element ) {
    // note: element is <a> element that contains button ;
    // this returns an array of all the elements except the
    return Array.prototype.slice.call( element.parentNode.children, 1 );
  }
};
