(function () {

  'use strict';

  onl.decorate({
    'init-copydata': function( element ) {
      new copydata( element );
    }
  });

  var copydata = function( element ) {
    this.element = element;
    this.datafield = element.querySelector( '.js-copydata__datafield' );
    this.config = JSON.parse( this.element.getAttribute( 'data-config' ) ) || [];
    this.init();
  };

  copydata.prototype.init = function( ) {
    this.createAndPlaceTrigger();
    this.addEventListerners();
  };

  copydata.prototype.addEventListerners = function() {
    this.trigger.addEventListener( 'click', function( e ) { this.triggerCopy( e ); }.bind( this ), false );
  };

  copydata.prototype.triggerCopy = function() {
    this.putValueInClipboard();
  };

  copydata.prototype.createAndPlaceTrigger = function() {
    this.trigger = document.createElement( 'a' );
    this.trigger.classList.add( this.config.triggerClass );
    this.trigger.innerText = this.config.triggerLabel;
    this.element.appendChild( this.trigger );
  };

  copydata.prototype.giveFeedbackToUser = function() {
    var self = this;
    var originalLabel = this.trigger.innerText;
    var tempLabel = this.config.triggerCopiedlabel || 'Gekopiëerd';

    this.trigger.innerHTML = tempLabel;

    setTimeout( function(){
      self.trigger.innerHTML = originalLabel;
    }, 3000 );

  };

  copydata.prototype.putValueInClipboard = function() {
    if ( document.selection ) {
      var range = document.body.createTextRange( this.datafield );
      range.moveToElementText();
      range.select().createTextRange();
      document.execCommand( "copy" );
    } else if ( window.getSelection ) {
      var range = document.createRange();
      range.selectNode( this.datafield );
      window.getSelection().removeAllRanges( range );
      window.getSelection().addRange( range );
      document.execCommand( "copy" );
    }
    this.giveFeedbackToUser();
  };

})();

