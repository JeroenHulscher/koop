

var kpmService = function (action, data) {
  this.data = data;

  if ( action === 'push') {
    this.push( data );
  }
};

kpmService.prototype.push = function( data ) {
  window.kaartprikmodule = window.kaartprikmodule || [];
  window.kaartprikmodule.push( [ 'bootstrapKpm', data ] );
  console.log('pussssht', data);
};

new kpmService();
