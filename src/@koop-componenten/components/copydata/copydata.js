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
    this.addEventListeners();

    this.trigger.setAttribute('aria-live', 'polite');
  };

  copydata.prototype.addEventListeners = function() {
    this.trigger.addEventListener( 'click', function( e ) { this.triggerCopy( e ); }.bind( this ), false );
  };

  copydata.prototype.triggerCopy = function(e) {
    e.preventDefault();

    this.putValueInClipboard();
  };

  copydata.prototype.createAndPlaceTrigger = function() {
    this.trigger = document.createElement( 'button' );
    this.triggerSpan = document.createElement( 'span' );
    this.trigger.classList.add( this.config.triggerClass );
    this.trigger.setAttribute('tabindex', '0');
    this.trigger.setAttribute('aria-label', this.config.triggerLabel + ':' + this.datafield.innerHTML);
    this.triggerSpan.innerText = this.config.triggerLabel;
    this.trigger.appendChild(this.triggerSpan);
    this.element.appendChild( this.trigger );
  };

  copydata.prototype.giveFeedbackToUser = function() {
    var self = this;
    var originalLabel = this.trigger.innerText;
    var tempLabel = this.config.triggerCopiedlabel || 'Gekopiëerd';

    this.trigger.classList.add("is-active");
    this.triggerSpan.innerHTML = tempLabel;
    this.trigger.setAttribute('aria-label', tempLabel);

    setTimeout( function(){
      self.triggerSpan.innerHTML = originalLabel;
      self.trigger.setAttribute('aria-label', self.config.triggerLabel + ':' + self.datafield.innerHTML);
      self.trigger.classList.remove("is-active");
    }, 10000 );

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
