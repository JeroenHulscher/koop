

var kpmService = function (action, data) {
  this.data = data;

  if ( action === 'push') {
    this.push( data );
  }
};

kpmService.prototype.push = function( data ) {
  window.kaartprikmodule = window.kaartprikmodule || [];
  window.kaartprikmodule.push( [ 'bootstrapKpm', data ] );
};

new kpmService();
