(function() {
  onl.handle({
    'toggle-active-item': function(element, event) {
      var activeItem = document.getElementsByClassName('content-item active');
      console.log(element);

      console.log(activeItem[0] === event.target);

      if(activeItem[0] === event.target) {
        event.target.classList.remove('active');
        return;
      } else if(activeItem.length > 0) {
        activeItem[0].classList.remove('active');
      }

      event.target.classList.add('active');
    }
  });
})();
