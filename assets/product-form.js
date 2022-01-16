if (!customElements.get('product-form')) {
     customElements.define('product-form', class ProductForm extends HTMLElement {
          constructor() {
               super();

               this.inCart = this.isProductInCart();
               this.cartCount = parseInt(this.dataset.cartcount);

               this.id = this.dataset.product;

               this.updateHandler = this.updateHandler.bind(this);

               this.init();
          }

          init() {
               if (this.classList.contains('out_stock')) {
                    this.querySelectorAll('button').forEach((e) => {
                         e.disabled = true;
                    })

                    return;
               }

               this.initializeForm();

               this.cartNotification = document.querySelector('cart-notification');

               this.initializeFields();
               this.initializeButtons();

               if (this.inCart) {
                    this.field.addEventListener('change', this.fixUpdateCart.bind(this));
               }
          }

          initializeForm() {
               this.form = this.querySelector('form');

               this.form.querySelector('[name=id]').disabled = false;

               this.form.addEventListener('submit', this.updateHandler);

               return this.form;
          }

          initializeButtons() {
               return this.button = this.querySelector('button.add-cart-btn');
          }

          initializeFields() {
               return this.field = this.querySelector('quantity-box-set input.quantity');
          }

          isProductInCart() {
               return this.classList.contains('in_cart');
          }

          fixUpdateCart(e) {
               if (this.field.value != this.cartCount) {
                    this.button.disabled = false;
                    this.button.classList.remove('loading', 'disabled', 'complete');
                    this.button.classList.add('upd_cart');
               } else {
                    if (this.cartCount == 0) {
                         this.classList.remove('in_cart');
                         this.button.classList.remove('upd_cart', 'disabled', 'loading', 'complete', 'in_cart');
                         this.button.classList.add('add_to');
                         this.field.setAttribute('min', '1');
                         this.field.value = 1;
                    } else {
                         this.button.disabled = true;
                         this.button.classList.remove('upd_cart');
                         this.button.classList.add('disabled');
                         this.field.setAttribute('min', '0');
                    }
               }
          }

          changeLoadingState(load, complete) {
               if (!load && complete) {
                    this.button.classList.remove('loading');
                    this.button.classList.add('complete');
                    setTimeout(() => {
                         this.changeLoadingState(false, false)
                    }, 1500);
                    return;
               }

               this.button.disabled = load;
               
               (load) ? (this.button.classList.remove('upd_cart', 'add_to'), this.button.classList.add('loading', 'disabled'), this.querySelector('quantity-box-set').disableAll()) : (this.button.classList.remove('loading', 'disabled', 'complete'), this.fixUpdateCart(), this.querySelector('quantity-box-set').enableAll());
          }

          updateHandler(e) {
               e.preventDefault();

               if (this.button.classList.contains('loading')) return;

               this.handleErrorMessage(false);
               this.changeLoadingState(true);

               this.field.disabled = false;

               this.cartNotification.setActiveElement(document.activeElement);

               const config = fetchConfig('javascript');
               config.headers['X-Requested-With'] = 'XMLHttpRequest';
               config.body = JSON.stringify({
                    ...JSON.parse(serializeForm(this.form)),
                    sections: this.cartNotification.getSectionsToRender().map((section) => section.id),
                    sections_url: window.location.pathname
               });

               fetch((this.inCart) ? `${routes.cart_change_url}` : `${routes.cart_add_url}`, config)
               .then((response) => response.json())
               .then((response) => {
                    if (response.status) {
                         this.handleErrorMessage(response.description);
                         return;
                    }

                    this.cartCount = this.field.value;

                    if (this.field.value == 0) {
                         this.inCart = false;

                         document.getElementById('header-cart').innerHTML = new DOMParser()
                         .parseFromString(response.sections['header-cart'], 'text/html')
                         .querySelector('.header-cart').innerHTML
                    } else {
                         this.inCart = true;
                         this.field.addEventListener('change', this.fixUpdateCart.bind(this));

                         this.cartNotification.renderContents(response, this.id);
                    }
               })
               .catch((e) => {
                    console.error(e);
               })
               .finally(() => {
                    this.changeLoadingState(false, true);
               });
          }

          handleErrorMessage(errorMessage) {
               this.errorMessageWrapper = this.errorMessageWrapper || this.querySelector('.product-form__error-message-wrapper');
               this.errorMessage = this.errorMessage || this.errorMessageWrapper.querySelector('.product-form__error-message');
     
               if (errorMessage) {
                    this.errorMessage.textContent = errorMessage;
                    this.errorMessageWrapper.classList.remove('hidden')
               } else {
                    this.errorMessage.textContent = "";
                    this.errorMessageWrapper.classList.add('hidden');
               }
          }
     });
}
