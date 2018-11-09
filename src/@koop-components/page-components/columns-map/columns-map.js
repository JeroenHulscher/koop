(function() {
  onl.decorate({
    'active-item-toggle': function(element, event) {
      var contentItems = element.querySelectorAll('.content-item');

      contentItems.forEach(function(item) {
        item.addEventListener('click', function(e) {
          if(e.target.type === 'button') {
            return;
          }

          var activeItem = document.getElementsByClassName('content-item active');

          if(activeItem.length > 0) {
            // If the current item clicked is the active item, remove class and return early.
            if(activeItem[0] === item) {
              activeItem[0].classList.remove('active');
              return;
            }

            activeItem[0].classList.remove('active');
          }

          item.classList.add('active');
        });
      });
    }
  });
})();
