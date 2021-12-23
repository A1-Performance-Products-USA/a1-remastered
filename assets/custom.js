/* Credits to https://gist.github.com/jjmu15 for the isInView method. */
HTMLElement.prototype.isInView = function() {
     var rect = this.getBoundingClientRect();
     var html = document.documentElement;
     return (
          rect.top >= 0 &&
          rect.left >= 0 &&
          rect.bottom <= (window.innerHeight || html.clientHeight) &&
          rect.right <= (window.innerWidth || html.clientWidth)
     );
}

function formatNumber(num) {
     return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}

/**
 * Background
 */
 var Background = {
     init: function () {
          $('body').data('locked', false);
     },
     isLocked: function () {
          return $('body').data('locked');
     },
     lockPage: function (locker) {
          $('body').addClass(locker);
          $('body').data('locked', locker);
     },
     unlockPage: function (locker) {
          $('body').removeClass(locker);
          $('body').data('locked', false);
     }
}
$(document).ready(function () {
     Background.init();
})