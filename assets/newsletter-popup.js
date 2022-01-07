class NewsletterPopup extends HTMLElement {
     constructor() {
          super();

          this.closeBackground = this.querySelector('.close-overlay');
          this.closeButton = this.querySelector('button.close');
          this.checkbox = this.querySelector('input[type="checkbox"]');

          this.first_show = this.dataset.first || 0;
          this.next_show = this.dataset.next || 1;

          this.initialize();
     }

     initialize() {
          try {
               this.closeBackground.addEventListener('click', NewsletterPopup.close);
               this.closeButton.addEventListener('click', NewsletterPopup.close);
               this.checkbox.addEventListener('change', this.checkAction.bind(this));

               setTimeout(() => {
                    if (!NewsletterPopup.shouldOpen()) return;

                    NewsletterPopup.open();

                    var date = new Date();
                    date.setTime(date.getTime() + (this.next_show * 60 * 1000));

                    NewsletterPopup.disable(date);
               }, this.first_show)
          } catch (e) {
               console.error(e);
          }
     }

     checkAction(e) {
          if (e.target != this.checkbox) return;

          if (this.checkbox.checked) {
               NewsletterPopup.disable(7);
          } else {
               NewsletterPopup.enable();
          }
     }

     static getCookie() {
          return Cookies.get('popupNewsletter');
     }

     static disable(expiration) {
          Cookies.set('popupNewsletter', 'disabled', { 
               expires: expiration, 
               path: '/' 
          });
     }

     static enable() {
          Cookies.remove('popupNewsletter', { path: '/' });
     }

     static open() {
          const el = document.querySelector('.newsletter-popup-wrapper');
          el.style.display = 'block';
          el.style.opacity = 0;

          (function fade() {
               var val = parseFloat(el.style.opacity);
               if (!((val += .1) > 1)) {
                   el.style.opacity = val;
                   requestAnimationFrame(fade);
               }
          })();
     }

     static close() {
          const el = document.querySelector('.newsletter-popup-wrapper');
          el.style.display = 'block';
          el.style.opacity = 1;

          (function fade() {
               if ((el.style.opacity -= .1) < 0) {
                   el.style.display = "none";
               } else {
                   requestAnimationFrame(fade);
               }
          })();
     }

     static shouldOpen() {
          if (!NewsletterPopup.getCookie()) return true;

          if (NewsletterPopup.getCookie() != 'disabled') return true;

          return false;
     }
}

customElements.define('newsletter-popup', NewsletterPopup);