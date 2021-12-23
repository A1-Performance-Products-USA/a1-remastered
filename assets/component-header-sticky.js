var LaptopScreenBreak = 1024;
var TabletScreenBreak = 768;
var MobileScreenBreak = 480;
/**
 * Sticky Navigation
*/
var StickyHeader = {
     moveNavigation: function () {
          //Don't do anything on mobile size.
          if ($(window).width() < LaptopScreenBreak) {
               return
          }

          if ($(window).scrollTop() > $('.site-header').height()) {
               if ($('.center-nav').has('#accessibleNav').length || !$('.sticky-header-wrapper').hasClass('active')) {
                    return;
               }

               $('#accessibleNav').prependTo('.center-nav');
          } else {
               if ($('.header-nav').has('#accessibleNav').length) {
                    return;
               }

               $('#accessibleNav').prependTo('.header-nav');
          }
     },
     moveSearch: function () {
          if ($(window).width() < LaptopScreenBreak) {
               return;
          }

          if ($(window).scrollTop() > $('.site-header').height()) {
               if ($('.sticky-header').has('.header-search').length || !$('.sticky-header-wrapper').hasClass('active')) {
                    return;
               }

               $('.header-search').appendTo('.sticky-header');
          } else {
               if ($('.header-right').has('.header-search').length) {
                    return;
               }

               $('.header-search').appendTo('.header-right');
          }
     },
     scroll: function () {
          if ($(window).width() < LaptopScreenBreak) {
               return;
          }

          this.moveNavigation();
          this.moveSearch();

          if ($(window).scrollTop() > $('.site-header').height()) {
               if (!$('.sticky-header-wrapper').hasClass('active')) {
                    $('.sticky-header-wrapper').addClass('active');
               }
          } else {
               if ($('.sticky-header-wrapper').hasClass('active')) {
                    $('.sticky-header-wrapper').removeClass('active');
               }
          }
     },
     scrollMobile: function () {
          if ($(window).width() >= LaptopScreenBreak) {
               return;
          }

          if ($(window).scrollTop() > $('.mobile-header').height()) {
               if (!$('.sticky-mobile-header').hasClass('active')) {
                    $('.sticky-mobile-header').addClass('active');
               }
          } else {
               if ($('.sticky-mobile-header').hasClass('active')) {
                    $('.sticky-mobile-header').removeClass('active');
               }
          }

          MobileSearchPopout.checkTop();
     },
     mobileResize: function () {
          if ($(window).width() <= LaptopScreenBreak) {
               return;
          }

          if ($('.sticky-mobile-header').hasClass('active')) {
               $('.sticky-mobile-header').removeClass('active');
          }
     }
}

$(document).ready(function () {
     StickyHeader.moveNavigation();
     StickyHeader.moveSearch();
});
$(window).scroll(function () {
     StickyHeader.scroll();
     StickyHeader.scrollMobile();
});
$(window).resize(function () {
     StickyHeader.mobileResize();
     StickyHeader.moveNavigation();
     StickyHeader.moveSearch();
});