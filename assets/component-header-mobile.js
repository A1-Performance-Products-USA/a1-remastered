/**
 * Mobile Search Popout
 */
 var MobileSearchPopout = {
     checkTop: function () {
          //Don't adjust the height when not collapsed.
          if ($(window).width() > LaptopScreenBreak) {
               return;
          }

          if ($('.sticky-mobile-header').hasClass('active')) {
               var paddingAddition = 10 * 2;
               var topHeight = ($('.sticky-mobile-header.active').height() + paddingAddition);

               $('.mobile-search-wrapper').css('top', topHeight);
          } else {
               var topHeight = ($('header').height() - $(window).scrollTop());

               $('.mobile-search-wrapper').css('top', topHeight);
          }
     },
     moveSearch: function () {
          if ($(window).width() > LaptopScreenBreak) {
               return;
          }

          if ($('.mobile-search-wrapper').has('.header-search').length) {
               return;
          }

          $('.header-search').appendTo('.mobile-search-wrapper');
     },
     startUp: function () {
          $('.mobile-search-wrapper').slideUp(0);
     },
     slideToggle: function (target) {
          if (Background.isLocked() && Background.isLocked() != 'open-search') {
               return;
          }

          if ($(target).data('toggle') == '0') {
               Background.lockPage('open-search');
               $(target).slideDown(1000).data('toggle', '1');
          } else {
               $(target).slideUp(1000, function() {
                    Background.unlockPage('open-search');
               }).data('toggle', '0');
          }
     },
     init: function () {
          this.checkTop();
          this.moveSearch();
          this.startUp();

          $('.search-icon').on('click', function () {
               if ($(window).width() > LaptopScreenBreak) {
                    return;
               }

               MobileSearchPopout.slideToggle('.mobile-search-wrapper');
          });
     },
     scroll: function () {
          this.checkTop()
     },
     resize: function () {
          this.checkTop();
          this.moveSearch();
     }
}

$(document).ready(function () {
     MobileSearchPopout.init();
});
$(window).resize(function () {
     MobileSearchPopout.resize();
});
$(window).scroll(function () {
     MobileSearchPopout.scroll();
});