/**
 * Element.matches() polyfill (simple version)
 * https://developer.mozilla.org/en-US/docs/Web/API/Element/matches#Polyfill
 */
if (!Element.prototype.matches) {
  Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
}

/**
 * Feature test
 * @return {Boolean} Returns true if required methods and APIs are supported by the browser
 */
var supports = function () {
  if (!document.addEventListener && !document.querySelector('body')) {
    return false;
  }
  return true;
};

(function () {
  'use strict';

  onl.decorate({
    'init-form-bwbvalidation': function (element) {
      // new formvalidation(element);
      var submitHandler = function(event) {
        event.preventDefault();
        if(Page_ClientValidate()){
          element.submit();
        }
    };
      element.addEventListener("submit", submitHandler, true);
    }
  });

})();
/*
Inspired by Go Make Things, LLC's project "validate", MIT, https://github.com/cferdinandi/validate
*/
