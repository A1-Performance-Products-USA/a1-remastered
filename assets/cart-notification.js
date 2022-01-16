class CartNotification extends HTMLElement {
     constructor() {
          super();

          this.notification = document.getElementById('cart-notification');
          this.onBodyClick = this.handleBodyClick.bind(this);

          this.notification.addEventListener('keyup', (evt) => evt.code === 'Escape' && this.close());
          this.querySelectorAll('.close-btn').forEach((closeButton) =>
               closeButton.addEventListener('click', this.close.bind(this))
          );
          this.querySelector('.overlay').addEventListener('click', this.close.bind(this));
     }

     open() {
          this.querySelector('.cart-notification-wrapper').classList.add('animate', 'active');
          this.notification.classList.add('animate', 'active');

          this.querySelector('.overlay').classList.add('active');

          this.notification.addEventListener('transitionend', () => {
               this.notification.focus();
               trapFocus(this.notification);
          }, {
               once: true
          });

          document.body.addEventListener('click', this.onBodyClick);
          this.querySelector('.overlay').addEventListener('click', this.onBodyClick);
     }

     close() {
          this.notification.classList.remove('active');
          this.querySelector('.cart-notification-wrapper').classList.remove('active');

          this.querySelector('.overlay').classList.remove('active');

          document.body.removeEventListener('click', this.onBodyClick);
          this.querySelector('.overlay').removeEventListener('click', this.onBodyClick);

          removeTrapFocus(this.activeElement);
     }

     renderContents(parsedState, id) {
          this.productId = id || parsedState.id;
          this.getSectionsToRender().forEach((section => {
               document.getElementById(section.id).innerHTML =
                    this.getSectionInnerHTML(parsedState.sections[section.id], section.selector);
          }));

          this.open();
     }

     getSectionsToRender() {
          return [
               {
                    id: 'cart-notification-product',
                    selector: `#cart-notification-product-${this.productId}`,
               },
               {
                    id: 'cart-notification-button',
               },
               {
                    id: 'header-cart',
                    selector: '.header-cart',
               }
          ];
     }

     getSectionInnerHTML(html, selector = '.shopify-section') {
          return new DOMParser()
               .parseFromString(html, 'text/html')
               .querySelector(selector).innerHTML;
     }

     handleBodyClick(evt) {
          const target = evt.target;
          if (target !== this.notification && !target.closest('cart-notification')) {
               const disclosure = target.closest('details-disclosure');
               this.activeElement = disclosure ? disclosure.querySelector('summary') : null;
               this.close();
          }
     }

     setActiveElement(element) {
          this.activeElement = element;
     }
}

customElements.define('cart-notification', CartNotification);