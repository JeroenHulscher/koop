module.exports = {

  'getFoldableChildren' : function( element ) {
    // note: element is <a> element that contains button ;
    // this returns an array of all the elements except the
    return Array.prototype.slice.call( element.parentNode.children, 1 );
  },
  'getFoldableChildrenIDRef': function( foldableChildren ) {
    var string = '';

    for ( var i = 0; i < foldableChildren.length; i++ ) {
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
