class AddToCart extends HTMLElement {
     constructor() {
          super();

          this.init();
     }

     init() {
          if (this.classList.contains('out_stock')) {
               this.querySelector('button').disabled = true;
               return;
          }

          this.form = this.querySelector('form');
          this.form.querySelector('[name=id]').disabled = false;
          this.button = this.querySelector('button');

          this.form.addEventListener('submit', this.onSubmitHandler.bind(this));
          this.cartNotification = document.querySelector('cart-notification');
     }

     onSubmitHandler(e) {
          //Prevent submission
          e.preventDefault();

          if (!this.form || !this.button || !this.cartNotification) this.init();

          if (this.button.classList.contains('loading')) return;

          this.handleErrorMessage(false);
          this.cartNotification.setActiveElement(document.activeElement);

          this.button.setAttribute('aria-disabled', true);
          this.button.classList.add('loading');
          this.button.classList.add('disabled');

          const config = fetchConfig('javascript');
          config.headers['X-Requested-With'] = 'XMLHttpRequest';
          config.body = JSON.stringify({
               ...JSON.parse(serializeForm(this.form)),
               sections: this.cartNotification.getSectionsToRender().map((section) => section.id),
               sections_url: window.location.pathname
          });

          //send request for cart addition
          fetch(`${routes.cart_add_url}`, config)
          .then((response) => response.json())
          .then((response) => {
               if (response.status) {
                    this.handleErrorMessage(response.description);

                    const getOffset = ( el ) => {
                         var _x = 0;
                         var _y = 0;
                         while( el && !isNaN( el.offsetLeft ) && !isNaN( el.offsetTop ) ) {
                             _x += el.offsetLeft - el.scrollLeft;
                             _y += el.offsetTop - el.scrollTop;
                             el = el.offsetParent;
                         }
                         return { top: _y, left: _x };
                    }

                    window.scroll({
                         top: getOffset(document.querySelector('.breadcrumb')).top,
                         behavior: 'smooth'
                    });
                    return;
               }
 
               this.cartNotification.renderContents(response);
          })
          .catch((e) => {
               console.error(e);
          })
          .finally(() => {
               this.button.classList.remove('loading');
               this.button.classList.remove('disabled');
               this.button.removeAttribute('aria-disabled');
          });
     }

     handleErrorMessage(errorMessage = false) {
          this.errorMessageWrapper = this.errorMessageWrapper || document.querySelector('.product-form__error-message-wrapper');
          this.errorMessage = this.errorMessage || this.errorMessageWrapper.querySelector('.product-form__error-message');

          if (errorMessage) {
               this.errorMessage.textContent = errorMessage;
               this.errorMessageWrapper.classList.remove('hidden')
          } else {
               this.errorMessage.textContent = "";
               this.errorMessageWrapper.classList.add('hidden');
          }
     }
}

customElements.define('add-to-cart', AddToCart);