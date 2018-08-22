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
    this.giveFeedbackToUser();
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
    var tempLabel = this.config.triggerCopiedlabel || 'Gekopieerd';

    this.trigger.innerHTML = tempLabel;

    setTimeout( function(){
      self.trigger.innerHTML = originalLabel;
    }, 3000 );

  };

  copydata.prototype.putValueInClipboard = function() {
    var el = document.createElement( 'textarea' );

    el.value = this.datafield.innerText;
    el.setAttribute( 'readonly', '' );
    el.style.position = 'absolute';
    el.style.left = '-9999px';
    document.body.appendChild( el );

    el.select();
    document.execCommand( 'copy' );
    document.body.removeChild( el );
  };

})();

