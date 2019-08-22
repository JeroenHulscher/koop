( function() {

  'use strict';

  onl.decorate({
    'to-top': function( element ) {
      var el = element;
      el.classList.add('irrelevant');
      window.addEventListener('scroll', function () {
        var footer = document.querySelector('.footer');
        var footerTop = footer.offsetTop;
        var scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        if (scrollTop > 500 && (scrollTop + window.innerHeight <= footerTop ) ) {
          el.classList.remove('irrelevant');
        } else {
          el.classList.add('irrelevant');
        }
      });
    }

  });

})();
