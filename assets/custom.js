$(document).ready(function() {
     /**
      * Fix Site Inner Height
     */
     var totalHeight = $(window).height();
     var headerHeight = $('header').height();
     var footerHeight = $('footer').height();
     var minHeight = totalHeight - (headerHeight + footerHeight);

     minHeight = minHeight - $('.newsletter-signup-wrapper').height();

     $('.site-inner').css('min-height', minHeight);

     /**
      * Captcha
     */
     if ($('.shopify-challenge__container').length != 0) {
          $('.shopify-challenge__container').addClass('page-content').wrap('<div class="page-content-wrapper"></div>');

          $('<h2>{{ "general.captcha.title" | t }}</h2>').insertBefore('.shopify-challenge__message');

          $('.shopify-challenge__button').wrap('<div class="form-submit-center"></div>').replaceWith('<button type="submit" class="btn">{{ "general.captcha.submit" | t }}</button>');
     }

     /**
      * Email Marketing Subscription
     */
     if ($('.shopify-email-marketing-confirmation__container').length != 0) {
          $('.shopify-email-marketing-confirmation__container').addClass('page-content').wrap('<div class="page-content-wrapper"></div>');


          $('.shopify-email-marketing-confirmation__container > h1').replaceWith(function () {
               return "<h2>" + $(this).html() + "</h2>";
          });

          $('.shopify-email-marketing-confirmation__container > a').replaceWith('<button type="submit" class="btn">{{ "newsletter.unsubscribe" | t }}</button>');
     }
});
